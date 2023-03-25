//requerimos express
const express = require('express');


//requerimos el modelo de los coches
const Cars = require('../models/Cars.js');

//llamamos a la función de manejo de errores
const createError = require('../utils/errors/create-errors.js');

//requerimos los middlewares
const isAuthBuyer = require('../utils/middlewares/auth-buyer.middleware.js');
const isAuthSeller = require('../utils/middlewares/auth-seller.middleware.js');
const upload = require('../utils/middlewares/file.middleware.js');

//requerimos uri para subida de imagenes
const imageToUri = require('image-to-uri');
const fs = require('fs');
const uploadToCloudinary = require('../utils/middlewares/cloudinary.middleware.js');

//creamos router para los coches
const carsRouter = express.Router();

//endpoit para todos los coches
carsRouter.get('/', async(req, res, next) => {
    try {
        //recuperamos todos los coches de la DB
        const cars = await Cars.find().populate('concesionarios');
        return res.status(200).json(cars);
    } catch (err) {
        next(err)
    }
});

//endpoint para buscar por id
//hacemos un endpoint /:id para recuperar por su id
carsRouter.get('/:id', async (req, res, next) => {
    //el id se encuentra dentro de los parametros de la req, la guardamos en una variable
    const id = req.params.id;
    try {
        const cars = await Cars.findById(id);
        if (cars) {
            return res.status(200).json(cars);
        } else {
            next(createError('No existe un coche con ese id', 404))
        }
    } catch (err) {
        next(err);
    } 

});

//endpoint para crear nuevos coches
carsRouter.post('/', [isAuthSeller, upload.single('picture'), uploadToCloudinary] ,async( req, res, next) => {
    try {
        
        //aplicamos el schema para crear nuevo coche
        //al que le mandamos la req que tiene toda la info
        const newCar = new Cars({...req.body, picture: req.file_url});
        //guardamos el nuevo coche en DB
        const createdCar = await newCar.save();
        //desvinculamos el archivo subido por multer
        if (filePath) {
            await fs.unlinkSync(filePath);
        }
        return res.status(201).json(createdCar)
    } catch (err) {
        next(err)
    }
});

//ruta para eliminar por id
carsRouter.delete('/:id', [isAuthSeller] ,async(req, res, next) => {
    try {
        //cogemos el id del coche
        const id = req.params.id;
        //eliminamos de la DB
        await Cars.findByIdAndDelete(id);
        return res.status(200).json('El coche ha sido eliminado correctamente');
    } catch (err) {
        next(err)
    }
});

//ruta para modificar coches
carsRouter.put('/:id', [isAuthSeller] ,async (req, res, next) => {
    try{
        //cogemos el id del coche
        const id = req.params.id;
        const modifiedCar = new Cars({...req.body});
        modifiedCar._id = id;
        const carsUpdate = await Cars.findByIdAndUpdate(
            id,
            { $set: {...modifiedCar}},
            {new: true}
        );
        return res.status(200).json(carsUpdate);
    } catch (err) {
        next(err)
    }
});


//exportamos 
module.exports = carsRouter;
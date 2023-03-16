//requerimos express
const express = require('express');


//requerimos el modelo de los coches
const Cars = require('../models/Cars.js');

//llamamos a la función de manejo de errores
const createError = require('../utils/errors/create-errors.js')

//creamos router para los coches
const carsRouter = express.Router();

//endpoit para todos los coches
carsRouter.get('/', async(req, res, next) => {
    try {
        //recuperamos todos los coches de la DB
        const cars = await Cars.find();
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
carsRouter.post('/', async( req, res, next) => {
    try {
        //aplicamos el schema para crear nuevo coche
        //al que le mandamos la req que tiene toda la info
        const newCar = new Cars({...req.body});
        //guardamos el nuevo coche en DB
        const createdCar = await newCar.save();
        return res.status(201).json(createdCar)
    } catch (err) {
        next(err)
    }
});

//ruta para eliminar por id
carsRouter.delete('/:id',  async(req, res, next) => {
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
carsRouter.put('/:id', async (req, res, next) => {
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
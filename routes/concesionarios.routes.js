//requerimos express
const express = require('express');

//llamamos al modelo
const Concesionarios = require('../models/Concesionarios.js')

//ejecutamos express
const concesionariosRouter = express.Router();


//ruta devuelve todos
concesionariosRouter.get('/', async( req, res, next) => {
    try {
        const concesionarios = await Concesionarios.find().populate('coches');
        return res.status(200).json(concesionarios);
    } catch (err) {
        next(err)
    }
});

//ruta para crear nuevos concesionarios
concesionariosRouter.post('/', async( req, res, next) => {
    try {
        const newConcesionario = new Concesionarios({...req.body});
        const createdConcesionario = await newConcesionario.save();
        return res.status(201).json(createdConcesionario)
    } catch (err) {
        next(err)
    }
});

//ruta para añadir coches a los concesionarios
concesionariosRouter.put('/addCar', async ( req, res, next) => {
    try{
        const {concesionariosId, carsId} = req.body;
        if(!concesionariosId) {
            return next(createError('Se neesita un id de Concesionario para añadir el coche', 500));
        };
        if(!carsId) {
            return next(createError('Se neesita un id de coche para añadirlo', 500));
        };
        const updatedConcesionario = await Concesionarios.findByIdAndUpdate(
            concesionariosId,
            { $push : {coches : carsId}},
            {new : true}
        );
        return res.status(201).json(updatedConcesionario)
    } catch (err) {
        next(err)
    }
});

//ruta para eliminar concesionarios
concesionariosRouter.delete('/:id',  async(req, res, next) => {
    try {
        //cogemos el id del coche
        const id = req.params.id;
        //eliminamos de la DB
        await Concesionarios.findByIdAndDelete(id);
        return res.status(200).json('El concesionario ha sido eliminado correctamente');
    } catch (err) {
        next(err)
    }
});


//exportamos modulo
module.exports = concesionariosRouter;
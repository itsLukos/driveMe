//requerimos express
const express = require('express');


//requerimos el modelo de los coches
const Cars = require('../models/Cars.js');

//creamos router para los coches
const carsRouter = express.Router();

//endpoit para todos los coches
carsRouter.get('/', async(req, res) => {
    try {
        //recuperamos todos los coches de la DB
        const cars = await Cars.find();
        return res.status(200).json(cars);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//endpoint para buscar por id
//hacemos un endpoint /:id para recuperar por su id
moviesRoutes.get('/:id', async (req, res) => {
    //el id se encuentra dentro de los parametros de la req, la guardamos en una variable
    const id = req.params.id;
    try {
        const cars = await Cars.findById(id);
        if (cars) {
            return res.status(200).json(cars);
        } else {
            return res.status(200).json('No existe coche con ese id');
        }
    } catch (err) {
        return res.status(404).json(err)
    }

});


//exportamos 
module.exports = carsRouter;
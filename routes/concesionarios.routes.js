//requerimos express
const express = require('express');

//ejecutamos express
const concesionariosRouter = express.Router();


//ruta get para path vacio
concesionariosRouter.get('/', (req, res) => {
    //respuesta que me devuleve
    res.send('Lista de concesionarios');
});


//exportamos modulo
module.exports = concesionariosRouter;
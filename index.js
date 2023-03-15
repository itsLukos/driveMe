//requerimos express
const express = require('express');

//importamos la ruta de los concesionarios
const concesionariosRouter = require('./routes/concesionarios.routes.js');

//importamos la función de conexión a la db
const connect = require('./utils/db/connect.js');

//ejecutamos función para conectar a la db
connect();

//puerto que usamos
const PORT = 3000;

//creamos server
const server = express();


server.use('/concesionario', concesionariosRouter)

server.listen(PORT, () => {
    console.log(`El servidor esta escuchando en el puerto ${PORT}`)
});
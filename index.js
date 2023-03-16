//requerimos express
const express = require('express');

//importamos la ruta de los concesionarios
const concesionariosRouter = require('./routes/concesionarios.routes.js');

//imporyamos ruta coches
const carsRouter = require('./routes/cars.routes.js');

//importamos la función de conexión a la db
const connect = require('./utils/db/connect.js');

//requerimos cors
const cors = require('cors');

//requerimos el manejo de errores
const createError = require('./utils/errors/create-errors.js')

//ejecutamos función para conectar a la db
connect();

//puerto que usamos
const PORT = 3000;

//creamos server
const server = express();

//le decimos que el server usa cors
server.use(cors({
    origin: ["http://localhost:4200"]
}));

//usamos express.json para parsear las peticiones en formato json
server.use(express.json());

//usamos express.urlencoded para parsear array y objetos
server.use(express.urlencoded({ extended : false }));

//ruta path vacio
server.get('/', (req, res) => {
    res.join('Bienvenido a la DB de DriveMe')
});

//ruta concesionarios
server.use('/concesionario', concesionariosRouter);

//ruta para los coches
server.use('/cars', carsRouter);

//hacemos manejo de error para todas las rutas que no tengamos creadas
server.use('*', (req, res, next) => {
    next(createError('No existe la ruta a la que intentas acceder', 404))
});

server.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err.message || 'error inesperado')
});

server.listen(PORT, () => {
    console.log(`El servidor esta escuchando en el puerto ${PORT}`)
});
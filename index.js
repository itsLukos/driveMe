//libreria dotenv
require('dotenv').config()

//requerimos express
const express = require('express');


//importamos la ruta de los concesionarios
const concesionariosRouter = require('./routes/concesionarios.routes.js');

//imporyamos ruta coches
const carsRouter = require('./routes/cars.routes.js');

//importams ruta usuarios
const usersRouter = require('./routes/users.routes.js');

//llamamos a express-session para guardar sesiones
const session = require('express-session');

//usamos mongoStore para guardar las sesiones
const MongoStore = require('connect-mongo');

const path = require('path');

const cloudinary = require('cloudinary');

//importamos la función de conexión a la db
const connect = require('./utils/db/connect.js');

//requerimos cors
const cors = require('cors');

//llamamos passport
const passport = require('passport');

//requerimos el manejo de errores
const createError = require('./utils/errors/create-errors.js')



//ejecutamos función para conectar a la db
connect();

//puerto que usamos
const PORT = process.env.PORT || 3000;

//URL de la base de datos
const DB_URL = process.env.DB_URL;

//creamos server
const server = express();

//para settear variables a nivel app
server.set("secretKey", "driveMeApi");

//cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARI_NAME, 
    api_key: process.env.KEY_CLOUDINARY, 
    api_secret:  process.env.SECRET_CLOUDINARY 
});


//le decimos que el server usa cors
server.use(cors());

//usamos express.json para parsear las peticiones en formato json
server.use(express.json());

//usamos express.urlencoded para parsear array y objetos
server.use(express.urlencoded({ extended : false }));

//archivos estaticos
server.use(express.static(path.join(__dirname, 'public')));

//requerimos la autenticacion de passport
require('./utils/authentication/passport.js');

//gestion de sesiones
//gestión de sesiones
server.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        //milisegundos de caducidad de la cookie
        maxAge: 120000
    }, 
    //guardamos sesion
    store: MongoStore.create({
        mongoUrl: DB_URL
    })
}));

//inicializamos passport
server.use(passport.initialize());

//usamos la sesison
server.use(passport.session());

//ruta path vacio
server.get('/', (req, res) => {
    res.json('Bienvenido a la DB de DriveMe')
});

//ruta concesionarios
server.use('/concesionarios', concesionariosRouter);

//ruta para los coches
server.use('/cars', carsRouter);

//ruta usuarios
server.use('/user', usersRouter)

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

module.exports = server;
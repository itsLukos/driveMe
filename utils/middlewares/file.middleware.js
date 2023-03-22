
//llamamos a multer
const multer = require('multer');

const path = require('path');
const createError = require('../errors/create-errors');

//tipos de archivos permitidos
const VALID_FILE_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

//filtro de archivos
const fileFilter = (req, file, cb) => {
    //si no es un archivo del array
    if(!VALID_FILE_TYPES.includes(file.mimetype)) {
        cb(createError('El tipo de archivo no es valido'))
    } else {
        cb (null, true)
    }
};

//almacenamos los archivos
const storage = multer.diskStorage({
    //nombre que le queremos dar a nuestro archivo
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
    //donde se guarda
    destination: (req, file, cb) => {
        cb(null, '/tmp/');
    }
});


//middleware
const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;
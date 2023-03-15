//requerimos mongoose
const mongoose = require('mongoose');

//URL de la base de datos
const DB_URL = "mongodb+srv://root:yKmprSQQn6lef7Hd@driveme.ohohktp.mongodb.net/?retryWrites=true&w=majority";

//funcion para conectar a la db
const connect = () => {
    mongoose.connect(DB_URL, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })
};

//exportamos la función de conexión
module.exports = connect;
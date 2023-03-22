//libreria dotenv
require('dotenv').config()
//requerimos mongoose
const mongoose = require('mongoose');

//requerimos modelo de los coches
const Concesionarios =   require('../../../models/Concesionarios.js');

//requerimos fs
const fs = require('fs');

//ruta para la url de la db
const DB_URL = process.env.DB_URL;

//conectamos a la db
mongoose.connect(DB_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(async () => {
    //en este then lo que hacemos es resetear todos los elementos
    const allConcesionarios = await Concesionarios.find();
    //si cars tiene longitud(tiene algo)
    if(allConcesionarios.length) {
        //eliminamos la coleccion
        await Concesionarios.collection.drop();
    }
}).catch(err => {
    console.log(`Ha habido un error eliminando los datos: ${err}`)
})
.then( async () => {
    //con este den una vez eliminado todo añadimos los documentos
    //leemos el json de manera asincrona y lo metemos en data
    const data = fs.readFileSync('./utils/seeds/db/concesionarios.json');
    //parseamos la data
    const parseData = JSON.parse(data);
    //mapeamos los datos para que de objetos pasean a ser doc que sigan
    //el esquema
    const concesionariosDocs = parseData.map((concesionarios) => {
        return new Concesionarios(concesionarios)
    });
    //añadimos todos los datos
    await Concesionarios.insertMany(concesionariosDocs);
})
.catch((err) => {
    //manejo errores
    console.log(`Ha habido un error añadiendo los elementos a la DB: ${err}`)
})
    //desconectamos la db
.finally(() => mongoose.disconnect());
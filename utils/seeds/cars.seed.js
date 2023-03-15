//requerimos mongoose
const mongoose = require('mongoose');

//requerimos modelo de los coches
const Cars =   require('../../models/Cars.js');

//requerimos fs
const fs = require('fs');

//ruta para la url de la db
const DB_URL = "mongodb+srv://root:yKmprSQQn6lef7Hd@driveme.ohohktp.mongodb.net/?retryWrites=true&w=majority";

//conectamos a la db
mongoose.connect(DB_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(async () => {
    //en este then lo que hacemos es resetear todos los elementos
    const allCars = await Cars.find();
    //si cars tiene longitud(tiene algo)
    if(allCars.length) {
        //eliminamos la coleccion
        await Cars.collection.drop();
    }
}).catch(err => {
    console.log(`Ha habido un error eliminando los datos: ${err}`)
})
.then( async () => {
    //con este den una vez eliminado todo añadimos los documentos
    //leemos el json de manera asincrona y lo metemos en data
    const data = fs.readFileSync('./utils/seeds/db/cars.json');
    //parseamos la data
    const parseData = JSON.parse(data);
    //mapeamos los datos para que de objetos pasean a ser doc que sigan
    //el esquema
    const carsDocs = parseData.map((car) => {
        return new Cars(car)
    });
    //añadimos todos los datos
    await Cars.insertMany(carsDocs);
})
.catch((err) => {
    //manejo errores
    console.log(`Ha habido un error añadiendo los elementos a la DB: ${err}`)
})
    //desconectamos la db
.finally(() => mongoose.disconnect());
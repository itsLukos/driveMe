//requerimos Mongoose
const mongoose = require('mongoose');

//esquema de los coches
const carSchema = new mongoose.Schema(
    {
        marca: {type: String, require: true},
        modelo: {type: String, require: true},
        nuevo: {type: String, require: true},
        concesionario: {type: String, require: true},
        motor: [String], 
        enum:[
            'Gasolina',
            'Diesel',
            'Electrico',
            'Hibrido'
        ],
        transmision: {type: String, require: true},
        cilindrada: {type: Number, require:true},
        carroceria: 
            [String], 
            enum:[
                'Urbano', 
                'Sedan', 
                'Hatchback', 
                'Descapotable', 
                'Coupe', 
                'Deportivo',
                'Monovolumen',
                'Todoterreno',
                'Suv',
                'Roadster',
                'Pickup',
                'Furgoneta'
            ],
        precio: {type: Number, require:true},
    }, {
        //añade fecha de creación y edición en la db
        timestamps: true
    }
);

//creamos la coleccion
const Cars = mongoose.model('Cars', carSchema);

//exportamos la colección
module.exports = Cars;
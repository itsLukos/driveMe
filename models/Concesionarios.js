//requerimos mongoose
const mongoose = require('mongoose');

const concesionariosSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    ccaa: {type: String, required: true},
    direccion: {type: String, required: true},
    telefono: {type: Number, required: true},
    coches: [{ type: mongoose.Types.ObjectId, ref: 'Cars'}]
    // rol: //meter con el modelo de usuarios
    //citas: meter con las citas
}, {
    timestamps: true
});

//creamos la coleccion
const Concesionarios = mongoose.model('Concesionarios', concesionariosSchema);

//exportamos
module.exports = Concesionarios;
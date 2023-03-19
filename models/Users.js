

//requerimos mongoose
const mongoose = require('mongoose');

//creamos el esquema
const userSchema = new mongoose.Schema({
    nombre: String,
    apellidos: String, 
    telefono: Number,
    email: {
        type: String,
        required: true,
        unique: true,
        // marcamos formato del email
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'El email introducido no tiene un formato válido']
    },
    password: {type: String, required: true},
    //añadimos roles, si no se pone nada será usuario basico
    role: { type: String, default: 'basic', enum: ['buyer', 'seller'] },
    //relacionamos con la colección de Movies
    favoriteCars: [{ type: mongoose.Types.ObjectId, ref: 'Cars' }],

}, {
    timestamps: true
});

//Creamos la coleccion, recibe 2 args
//    1.Nombre de la coleccion
//    2.Esquema que sigue que creamos arriba
const User = mongoose.model('User', userSchema);

//exportamos
module.exports = User;
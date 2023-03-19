//importamos manejo de errores
const createError = require("../errors/create-errors.js");

const isAuthBuyer = (req, res, next) => {
    //miramos si esta autenticado y si esta nos devuelve un booleano true
    if(req.isAuthenticated()) {
        return next();
    } else {
        return next(createError('No tienes permisos', 401))
    }
};

//exportamos
module.exports = isAuthBuyer;
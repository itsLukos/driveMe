//requerimos manejador de errores
const createError = require('../errors/create-errors.js');

//middleware para roles de sellers
const isAuthSeller = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === "seller") {
        return next();
    } else {
        return next(createError('No tienes permisos', 401))
    }
};

//exportamos
module.exports = isAuthSeller;
const jwt = require('jsonwebtoken');
const createError = require('../errors/create-errors');


const isAuthAdmin = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization) {
        return next(createError('No estas autorizado', 401));
    }
    const splitAuth = authorization.split(" ");
    if(splitAuth.length !== 2 || splitAuth[0] !== "Bearer"){
        return next(createError("Cabecera authentication incorrecta", 400))
    }
    const token = splitAuth[1];
    let payload;
    try {
        payload = jwt.verify(token, req.app.get('secretKey'));
        
    } catch (err) {
        return next(err);
    }
    req.authority = {
        id: payload.id,
        email: payload.email
    };
    next();
};

module.exports = isAuthAdmin;
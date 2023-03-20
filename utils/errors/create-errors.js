

//función manejo de errores
const createError = (mensaje, status) => {
    const error = new Error(mensaje);
    error.status = status;
    return error
};

//exportamos
module.exports = createError;
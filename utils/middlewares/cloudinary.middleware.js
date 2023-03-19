//requerimos libreria 
const cloudinary = require('cloudinary');

//requerimos lectura de arch
const fs = require('fs');


//funcion para updatear a cloudinary
const uploadToCloudinary = async ( req, res, next) => {
    if(req.file) {
        const filePath = req.file.path;
        const image = await cloudinary.v2.uploader.upload(filePath);

        await fs.unlinkSync(filePath);

        req.file_url = image.secure_url;
        return next();
    } else {
        return next()
    }
};

//exporto ´
module.exports = uploadToCloudinary;
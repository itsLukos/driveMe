//llamamos express
const express = require('express');

//llamamos a passport
const passport = require('passport');

//requerimos modelos ususarios
const Users = require('../models/Users.js');

//requerimos el modelo de los coches
const Cars = require('../models/Cars.js');


//requerimos los middlewares
const isAuthBuyer = require('../utils/middlewares/auth-buyer.middleware.js');
const isAuthSeller = require('../utils/middlewares/auth-seller.middleware.js');

//router para usuarios
const userRouter = express.Router();

//endpoit de registro
userRouter.post('/register', (req, res, next) => {
    const done = (err, user) => {
        if(err) {
            return next(err)
        }
        //iniciamos sesion con el user creado
        //2 argumentos: 1/usuario, 2/callback(si es correcto o hay error de logeo) 2.1/Error
        req.logIn(
            user,
            (err) => {
                if(err) {
                    return next(err);
                }
                return res.status(201).json(user)
            }
        )
    };
    //autenticamos al usuario: 1/nombre estrategia 2/done
    passport.authenticate('register', done)(req);
});

//endpoint para login
userRouter.post('/login', (req, res, next) => {
    const done = (err, user) => {
        if(err) {
            return next(err);
        }
        req.logIn(
            user,
            (err) => {
                if(err) {
                    return next(err);
                }
                return res.status(200).json('Has iniciado sesión');
            }
        )
    }
    passport.authenticate('login', done)(req);
});

//endpoint para logout
userRouter.post('/logout', (req, res, next) => {
    //probamos si hay usuario activo
    if(req.user) {
        //deslogeo al usuario
        req.logOut(() => {
            req.session.destroy(() => {
            //limpio la cookie
                res.clearCookie('connect.sid');
                return res.status(200).json('Te has deconectado');
            });
        });
    } else {
        return res.status(304).json('No hay nadie logeado')
    }
});

//endpoint para obtener todos los usuarios
userRouter.get('/', async (req, res, next) => {
    try {
        const allUsers = await Users.find({}, {password: 0}).sort({role: 1}).populate('favoriteCars');
        if (allUsers.length === 0) {
            return res.status(200).json('No hay usuarios registrados');
        }
        return res.status(200).json(allUsers)
    } catch (error) {
        return next(error)
    }
});

//endpoint para meter añadir coches cono favoritas
userRouter.put('/addFavoriteCar', [isAuthBuyer],async (req, res, next) => {
    try {
        const { userId, carId } = req.body;
        const currentCar = await Cars.findById(carId);
        const currentFavoriteCount = currentCar.favoriteCount;
        const favoriteUpdated = await Cars.findByIdAndUpdate(
            carId,
            { $set: { favoriteCount: currentFavoriteCount + 1 } },
            { new: true }
        );
        const userUpdated = await Users.findByIdAndUpdate(
            userId,
            { $push: { favoriteCars: currentCar } },
            { new: true }
        );
        return res.status(201).json(userUpdated);
    } catch (error) {
        return next(error)
    }
});

//endpoint para eliminar coches favoritos
userRouter.put('/removeFavoriteCar', [isAuthBuyer],async (req, res, next) => {
    try {
        const { userId, carId } = req.body;
        const currentCar = await Cars.findById(carId);
        const currentFavoriteCount = currentCar.favoriteCount;
        const favoriteUpdated = await Cars.findByIdAndUpdate(
            carId,
            { $set: { favoriteCount: currentFavoriteCount  -1 } },
            { new: true }
        );
        const userUpdated = await Users.findByIdAndUpdate(
            userId,
            { $pull: { favoriteCars: carId } },
            { new: true }
        );
        return res.status(201).json(userUpdated);
    } catch (error) {
        return next(error)
    }
});

//exportamos
module.exports = userRouter;
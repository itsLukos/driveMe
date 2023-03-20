//llamamos a passport
const passport = require("passport");

//llamamos la libreria de passport-local
const LocalStrategy = require("passport-local").Strategy;

//llamamos a bcrypt para encriptar las pass
const bcrypt = require("bcrypt");

//modelo usuarios
const User = require("../../models/Users");
const createError = require("../errors/create-errors.js");

//requerimos creador de errores
require('../errors/create-errors.js');

//generamos la estrategia de autenticación
passport.use(
  //nombre estrategia
  "register",
  //estrategia
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    //callback para cada vez que se registra un user
    async (req, email, password, done) => {
      try {
        //comprobamos que el usuario que se intenta registrar existe, por su email
        //que lo pusimos como unico y no puede haber dos iguales
        const previousUser = await User.findOne({ email });
        if (previousUser) {
          return done(createError("Este usuario ya existe, inicia sesión"));
        }
        //ahora encriptamos la pass
        const encPassword = await bcrypt.hash(password, 10);
        //creamos el nuevo user
        const newUser = new User({
          email,
          password: encPassword,
          role: req.body.role,
          nombre: req.body.name,
          apellidos: req.body.apellidos,
          telefono: req.body.telefono,
          favoriteCars: req.body.favoriteCars
        });
        //Guardamos al user en BD
        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//creamos estrategia de loggin
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const currentUser = await User.findOne({ email });
        //con la variable de arriba miramos si el usuario existe o no
        if (!currentUser) {
          return done(
            createError("No existe el usuario con ese email, registrate")
          );
        }
        //comparamos si la pass encriptada del usuario es igual a la del usuario de DB con compare, devuelve true si son iguales
        const isValidPassword = await bcrypt.compare(
          password,
          currentUser.password
        );
        //en caso de que no sean iguales
        if (!isValidPassword) {
          return done(createError("la contraseña es incorrecta"));
        }
        //vamos a ocualtar la contraseña del usuario cuando se logea
        currentUser.password = null;
        return done(null, currentUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//registrar user en la DB por id
passport.serializeUser((user, done) => {
  return done(null, user._id);
});

//buscamos al user por su id
passport.deserializeUser(async (userId, done) => {
  try {
    const existingUser = await User.findById(userId);
    return done(null, existingUser);
  } catch (err) {
    return done(err);
  }
});


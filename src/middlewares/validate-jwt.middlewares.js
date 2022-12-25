
//*#############################- importing libraries -#########################################

const jwt = require('jsonwebtoken');

//*#############################- importing the data models -#########################################

const User = require('../models/User.models');

const validateJWT = async ( req, res, next ) => {

    //Se almacena el token recibido del cliente:
    const token = req.headers.authorization;

    //*Verifico la existencia del token en la petición

    if(!token){
        return res.status(401).json({
            message: 'Error trying to authenticate 🤔',
        });
    };

    try {
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Error trying to authenticate. 💥🚫',
        })
    }

};


module.exports = validateJWT;


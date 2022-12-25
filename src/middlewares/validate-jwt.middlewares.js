
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

        //*Se comprueba la validez del token, si es válido, se obtiene el id del usuario del mismo
        const { uid } = await jwt.verify( token, process.env.JWT_SECRET );

        const theUser = await User.findById( uid );

        if(!theUser){
            return res.status(404).json({
                message: 'Error trying to authenticate! 🤔'
            })
        }
        
        //*Verifico que el usuario esté activo!
        if(!theUser.is_active){
            return res.status(404).json({
                ok: false,
                message: 'Error trying to authenticate! 🕸🕷🕸.'
            })
        }

        //! ########
        //!IMPORTANTE: Se añade información del usuario al request para que pueda ser utilizada en el resto de middlwares
        req.user = theUser;//Esta es la línea de código que me permite utilizar la información del usuario específico que está realizando las consultas. Porque si la request tiene esta info, SIGNIFICA QUE EL USUARIO VALIDÓ SU TOKEN Y/O TIENE UN TOKEN VÁLIDO, POR ENDE ESTÁ AUTORIZADO A HACER CONSULTAS ESPECÍFICAS CORRESPONDIENTES A SUS PERMISOS DE USUARIO.

        // Se continúa con la ejecución del resto de la petición
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Error trying to authenticate. 💥🚫',
        })
    };

};


module.exports = validateJWT;


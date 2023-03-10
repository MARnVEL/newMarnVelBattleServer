
//*#############################- importing libraries -#########################################
const jwt = require('jsonwebtoken');

//*#############################- importing the data models -#########################################
const User = require('../models/User.models');

const validateJWT = async ( req, res, next ) => {

    //Se almacena el token recibido del cliente:
    const token = req.headers.authorization;

    //*Verifico la existencia del token en la petici贸n

    if(!token){
        return res.status(401).json({
            message: 'Error trying to authenticate 馃',
        });
    };

    try {

        //*Se comprueba la validez del token, si es v谩lido, se obtiene el id del usuario del mismo
        const { uid } = await jwt.verify( token, process.env.JWT_SECRET );

        const theUser = await User.findById( uid );

        if(!theUser){
            return res.status(404).json({
                message: 'Error trying to authenticate! 馃'
            })
        }
        
        //*Verifico que el usuario est茅 activo!
        if(!theUser.is_active){
            return res.status(404).json({
                ok: false,
                message: 'Error trying to authenticate! 馃暩馃暦馃暩.'
            })
        }

        //! ########
        //!IMPORTANTE: Se a帽ade informaci贸n del usuario al request para que pueda ser utilizada en el resto de middlwares
        req.user = theUser;//Esta es la l铆nea de c贸digo que me permite utilizar la informaci贸n del usuario espec铆fico que est谩 realizando las consultas. Porque si la request tiene esta info, SIGNIFICA QUE EL USUARIO VALID脫 SU TOKEN Y/O TIENE UN TOKEN V脕LIDO, POR ENDE EST脕 AUTORIZADO A HACER CONSULTAS ESPEC脥FICAS CORRESPONDIENTES A SUS PERMISOS DE USUARIO.

        // Se contin煤a con la ejecuci贸n del resto de la petici贸n
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: 'Error trying to authenticate. 馃挜馃毇',
        })
    };

};


module.exports = validateJWT;


//*IMPORTING:
//*Importing the data model for the User.
const User = require('../models/User.models');

//*#############################- importing libraries -#########################################

const generateJWT = require('../helpers/generate-jwt.helpers');
const bcrypt = require('bcrypt');

ctrlAuth = {};

ctrlAuth.startSession = async (req, res) => {
    const {user_name, user_password} = req.body;

    /* //!Lineas para probar el código
    console.log(req.body)
    */

    try {

        const user = await User.findOne({user_name});
        /* //!Lineas para probar el código
        console.log(user);
        */
        //----------------- INICIO VALIDACIONES -------------------------------------------------------
        
        if(!user){
            return res.status(400).json({
                ok: false,
                message: "Error trying to authenticate 🤔.",
                //!Aquí la información adicional (la oración después del punto) sólo puede estar en desarrollo. no en producción
            });
        };

        //*Verifico que el usuario esté activo!
        if(!user.is_active){
            return res.status(400).json({
                ok: false,
                message: "Error trying to authenticate 🕸🕷🕸."
                //!Aquí la información adicional (la oración después del punto) sólo puede estar en desarrollo. no en producción
            });
        };

        //*VALIDACIÓN DE CONTRASEÑA:
        //*Con la biblioteca bcrypt comparo las contraseñas que envía el usuario a través de un formulario (en este caso en el body del rquest, con la contraseña que busco en la BD)
        //!la constante validatePass será true o false
        const validatePass = bcrypt.compareSync( user_password , user.user_password ); 

        if(!validatePass){
            return res.status(400).json({
                ok: false,
                message: "Error trying to authenticate 🚫."
                //!Aquí la información adicional (la oración después del punto) sólo puede estar en desarrollo. no en producción
            });
        } else {
            console.log("Contraseña correcta");
            
        };

        //----------------- FIN VALIDACIONES -------------------------------------------------------

        //*GENERACIÓN DE TOKEN:
        //!La lógica de generación de tokens está en la carpeta helpers
        const token = await generateJWT({ uid: user._id });
        //Cuando se hace la validación del jwt lo que se pega en la request, se pega con el guión bajo id ("_id"), y no con el uid. Ver controlador task (método createTask() del archivo task.controllers.js, en la parte de creación de una nueva tarea)
        return res.status(200).json({ 
            message: "Correct password! ✔",
            message2: `Welcome to the MATRIX ⚡🕶⚡, ${user_name}! ☘`,

            token });

    } catch (error) {

        console.log(error);
        return res.status(500).json({ 
            
            message: 'Error trying to LOG IN 🔴🔘🔴' ,
            
        });
    }

};


module.exports = ctrlAuth;



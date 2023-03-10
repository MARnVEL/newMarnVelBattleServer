//*IMPORTING:
//*Importing the data model for the User.
const User = require('../models/User.models');

//*#############################- importing libraries -#########################################

const generateJWT = require('../helpers/generate-jwt.helpers');
const bcrypt = require('bcrypt');

ctrlAuth = {};

ctrlAuth.startSession = async (req, res) => {
    const {user_name, user_password} = req.body;

    /* //!Lineas para probar el c贸digo
    console.log(req.body)
    */

    try {

        const user = await User.findOne({user_name});
        /* //!Lineas para probar el c贸digo
        console.log(user);
        */
        //----------------- INICIO VALIDACIONES -------------------------------------------------------
        
        if(!user){
            return res.status(400).json({
                ok: false,
                message: "Error trying to authenticate 馃.",
                //!Aqu铆 la informaci贸n adicional (la oraci贸n despu茅s del punto) s贸lo puede estar en desarrollo. no en producci贸n
            });
        };

        //*Verifico que el usuario est茅 activo!
        if(!user.is_active){
            return res.status(400).json({
                ok: false,
                message: "Error trying to authenticate 馃暩馃暦馃暩."
                //!Aqu铆 la informaci贸n adicional (la oraci贸n despu茅s del punto) s贸lo puede estar en desarrollo. no en producci贸n
            });
        };

        //*VALIDACI脫N DE CONTRASE脩A:
        //*Con la biblioteca bcrypt comparo las contrase帽as que env铆a el usuario a trav茅s de un formulario (en este caso en el body del rquest, con la contrase帽a que busco en la BD)
        //!la constante validatePass ser谩 true o false
        const validatePass = bcrypt.compareSync( user_password , user.user_password ); 

        if(!validatePass){
            return res.status(400).json({
                ok: false,
                message: "Error trying to authenticate 馃毇."
                //!Aqu铆 la informaci贸n adicional (la oraci贸n despu茅s del punto) s贸lo puede estar en desarrollo. no en producci贸n
            });
        } else {
            console.log("Contrase帽a correcta");
            
        };

        //----------------- FIN VALIDACIONES -------------------------------------------------------

        //*GENERACI脫N DE TOKEN:
        //!La l贸gica de generaci贸n de tokens est谩 en la carpeta helpers
        const token = await generateJWT({ uid: user._id });
        //Cuando se hace la validaci贸n del jwt lo que se pega en la request, se pega con el gui贸n bajo id ("_id"), y no con el uid. Ver controlador task (m茅todo createTask() del archivo task.controllers.js, en la parte de creaci贸n de una nueva tarea)
        return res.status(200).json({ 
            message: "Correct password! 鉁?",
            message2: `Welcome to the MATRIX 鈿○煏垛殹, ${user_name}! 鈽榒,

            token });

    } catch (error) {

        console.log(error);
        return res.status(500).json({ 
            
            message: 'Error trying to LOG IN 馃敶馃敇馃敶' ,
            
        });
    }

};


module.exports = ctrlAuth;



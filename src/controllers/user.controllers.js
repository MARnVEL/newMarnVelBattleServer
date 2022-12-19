
//*#############################- IMPORTING: -#########################################
//*Importing the data models-------------------------------------------------
const User = require('../models/User.models');
const Task = require('../models/Task.models');

//* importing libraries --------------------------------------------------------------
const bcrypt = require('bcrypt');

const generateJWT = require('../helpers/generate-jwt.helpers');

const ctrlUser = {};

//-------------------------------------------------------------------------------------------------------------
ctrlUser.getActiveUsers = async (req, res, next) => {
    try {
        const users = await User.find({is_active : true});
        // console.log('Se ontuvieron todos los usuarios activos');
        // !Se devuelve UN ARREGLO con los datos de las usuario ACTIVOS.
        return res.json({
            message: `Amount of users: ${users.length}`,
            users
        }).end();
    } catch (error) {
        console.log('Error trying to GET users', error);
        return res.status(404).json({
            message: 'Users not found',
            error:error.message
        }).end()
    }
};


//------------------------------------------------------------------------------------------------------
//! Controlador para OBTENER UN USUARIO ESPECÍFICO (Activo o inactivo). Requiere que se envíe en la url el id del usuario por el que se consulta la información.
//! Este método sólo puede ser ejecutado por usuarios con PERMISOS DE ADMINISTRADOR.

ctrlUser.getSpecificUser = async (req, res) => {

    const id_user = req.params.id_user;//!Este id_user (despues del params) debe estar igual, tanto en la ruta o endpoint como aquí!
    try {
        /*
        TODO fijarme bien el método findById(). Ver también el tema del $and... En los controladores de tareas la búsqueda con filtros la hice de otra forma.
        TODO await Task.find({isActive : true, user_id: req.user._id.toString()})
        TODO Funcionaría de igual forma el siguiente comando?:
        const user = await User.find({ 
            isActive : true, user_id: req.user._id.toString()
        })

        */

        // const user = await User.findById({$and: [{ "_id": id_user },{ isActive : true} ] });
        // const user = await User.find( { "user_id": id_user },{ isActive : true} );
        // const user = await User.find( {$and: [ { "user_id": id_user },{ isActive : true}] });
        const user = await User.findById( id_user );

        //*En caso que el usuario no se encuente:
        if (!user) {
            return res.status(404).json({
                message: 'User NOT FOUND',
            });
        };
        //*Ojo líneas para prueba de código
       /*  console.log("id_user: ", id_user);
        console.log("req.user._id: ", req.user._id.toString());
        console.log("Es admin: ", req.user.user_role ) */

        //*Si el usuario es un usuario común o no es admnin, devuelvo un mensaje aclarando esto
        //!CORRECCIÓN. Esto sólo serviría en caso de que no tenga un middleware. PEro en este caso, el único perfil de usuario que tiene acceso a este método es el administrador.
        //!Y la verificación siguiente estaría impidiendo el normal funcionamiento de la API, ya que al pasarle en la url el id de usuario al que quiero acceder este código me bloquearía la petición aún cuando el usuario que la hace sea un Admin, porque el id que estoy pasando puede ser tanto de un usuario Admin como uno que no lo sea.
        
/*         
        if (id_user !== req.user._id.toString() || req.user.user_role !== 'Admin') {
            return res.status(401).json({
                message: 'Usuario sin derechos de administrador'
            })
        }
 */
        //*Finalmente devuelvo el usuario encontrado.
        return res.status(200).json({
            message: 'User FOUND 🌟',
            user
       }).end();

        
    } catch (err) {
        console.log('Error trying to GET specific user', err);
        return res.status(404).json({
            message: 'Users not found',
            error:err.message
        }).end()
    };
};

//---------------------------------------------------------------------------------------------------------
//!Controlador para AÑADIR un usuario a la Base de Datos----------------------------------------------------
ctrlUser.addUser = async (req, res) => {

    const {
        user_name,
        user_email,
        user_password: recibed_password, //TODO check this
        user_role,
        is_admin,
        ... otherData
    } = req.body;

    //*Verifico que el nombre de usurio o la contraseña no sean strings muy cortos

    if (user_name.length < 6 && recibed_password.length < 8) {
        return res.status(400).json({
            message:"The user name or the user pass are too short. Try with longer strings"
        })
    }

    //*Encriptando la contraseña
    const new_password = await bcrypt.hashSync(recibed_password, 10);

    // console.log(req.body);

    try {

        //*Creación del nuevo usuario instanciando un nuevo objeto del modelo User (creado a través del UserSchema)
        const newUser = new User(
            {
                user_name,
                user_email,
                user_password : new_password,
                user_role,
                is_admin
            }
        );

        const user = await newUser.save();

        console.log('New user created: ', user);

        //*En caso de ser necesario, creo un token en la creación de usuarios nuevos.
        const token = await generateJWT({ uid: user._id });

        return res.json({
            msj : 'User created successfully ✨',
            data: user,
            token
        }).end();

    } catch (err) {
        console.log('Error trying to ADD user', err);
        return res.status(500).json({
            msg: 'There was an error in the ADDITION of the new user.'
        }).end();
    }
}


//---------------------------------------------------------------------------------------------------------
//!Controlador para ACTUALIZAR un usuario de la Base de Datos. Requiere que se le envíe id del usuario, el nombre del usuario y la contraseña-------
ctrlUser.updateUser = async (req, res) => {
    
    //*Primero identifico el usuario. Esta información viene en los parámetros del endpoint al que accede el usuario que hace la request
    const id_user = req.params.id_user;
    
    //!Este id_user (despues del params) DEBER ESTAR IGUAL, tanto en la ruta o endpoint como aquí!

    const {
        user_name,
        user_email,
        user_password,
        user_role,
        is_admin,
        ... otherDataUser
    } = req.body;

    //!Se desestructura lo que viene en el body para tomar sólo lo que me interesa.
    //El objeto data es para evitar tener que poner en los campos individualmente. Sólo se usaría si uso la función findByIdAndUpdate() del mongo, pero en mi caso estoy separando los pasos. Primero busco por id el usuario que quiero actualizar con findOne() y luego lo actualizo.
    const data = { user_name, user_email, user_password }

    if(!user_name || !user_email || !user_password) {

        console.log('The user data is incomplete!');
        return res.status(400).json({
            msg : 'Please fill all the fields correctly.',
            res: ["user_name", "user_email", "user_password"] //TODO check this!
        }).end();
    };

    //*Verifico que el nombre de usurio o la contraseña no sean strings muy cortos

    if (user_name.length < 6 && user_password.length < 8) {
        return res.status(400).json({
            message:"The user name or the user pass are too short. Try with longer strings",
            message2: "Users must have 7 or more characters and passwords more than eight"
        })
    }

    try {

        const theOldUser = await User.findOne({$and:[{_id: id_user}, {isActive: true}]});
        
        //*Verifico existencia del usuario
        if (!theOldUser) {
            return res.status(404).json({
                message: 'User NOT FOUND'
            });
        }

        //*Encripto la nueva contraseña
        const newPassword = bcrypt.hashSync(user_password,10);

        const theUpdatedUser = await theOldUser.updateOne({
            user_name,
            user_email,
            user_password: newPassword
        });

        console.log('The user has been updated successfully');
        return res.status(200).json({
            msj : 'User updated successfully ✨',
            user : theUpdatedUser
        }).end();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg : 'There was an error trying to UPDATE the user.'
        }).end();
    }

};


//---------------------------------------------------------------------------------------------------------
//!Controlador para ELIMINAR un usuario de la aplicación. NO SE ELIMINA DE Base de Datos. Requiere que se le envíe id del usuario-------
ctrlUser.softDeleteUser = async (req, res) => {
    const id_user = req.params.id_user;
    // const {
    // } = req.body

    try {
        const theUser = await User.findOne({$and:[{_id: id_user},{isActive: true}]});

        //*Verifico que el usuario que se intenta eliminar, efectivamente esté en la BD
        if (!theUser){
            return res.status(404).json({
                message: 'This user does not exist'
            });
        };

        const theDeletedUser = await theUser.updateOne({
            is_active: false
        });

        // console.log(theUser);
        console.log('The user has been deleted successfully');
        return res.status(200).json({
            msg: 'User DELETED successfully 🚫',
            user: theDeletedUser
        }).end();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg : 'Internal Server Error',
            msg2: 'There was an error trying to delete the user'
        });
    }
}

//---------------------------------------------------------------------------------------------------------
//!Controlador para ELIMINAR UN USUARIO DE LA BASE DE DATOS. Si se ejecuta este método se destruye toda la info del usuario de la base de datos. Requiere que se le envíe id del usuario-------
ctrlUser.hardDeleteUser = async (req, res) => {
    const id_user = req.params.id_user;
    // const {
    // } = req.body

    try {
        const theUser = await User.findOne({$and:[{_id: id_user},{isActive: true}]});

        //*Verifico que el usuario que se intenta eliminar, efectivamente esté en la BD
        if (!theUser){
            return res.status(404).json({
                message: 'This user does not exist'
            });
        };

        const theDeletedUser = await theUser.deleteOne();

        // console.log(theUser);
        console.log('The user has been deleted successfully');
        return res.json({
            msg: 'User DELETED successfully ⚡☢⚡',
            user: theDeletedUser
        }).end();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg: 'There was an error trying to DELETE and REMOVE FROM THE DATABASE the user'
        });
    }
}


//---------------------------------------------------------------------------------------------------------
//!Controlador para ELIMINAR UN USUARIO DE LA APLICACIÓN Y TAMBIÉN TODAS SUS TAREAS CREADAS. Si se ejecuta este método se cambia a inactivo el usuario de la base de datos, además de todas las tareas creadas por este usuario pasan a un estado incativo. Requiere que se le envíe id del usuario. No se requieren permisos de administrador porque el usuario sólo elimina sus tareas y su perfil, además este método sólo es un "soft-delete"-------


ctrlUser.fullSoftDeleteUser = async function (req, res) {

    const id_user = req.params.id_user;

    const user_id = req.user._id; //Obtengo el id del usuario que está en el jwt. Lo saco del validate jwt. Porque yo sé que mi middleware le agrega a la request la información del usuario.

     if(!user_id) {
        return res.status(400).json({
            message : 'No user id in the request'
        });
    }

    try {

        const theOldTasks = await Task.find({isActive : true, user_id: user_id.toString()})

        /* //!Lineas para probar el código
        console.log(theOldTasks)
        */

        if(!theOldTasks.length){
            return res.status(400).json({
                message: "This USER HAS NO TASKS to delete!"
            }).end()
        };

        /* //!Lineas para probar el código
        console.log("Entró al método 'deleteAllTasks'");
        console.log("theOldTasks: ", theOldTasks); 
        */

        //!ESTO 😎
        for (const task of theOldTasks) {
            await task.updateOne({isActive : false});
            /* //!Lineas para probar el código
            console.log("task: ", task);
            */
        }

        theDeletedTask = await Task.find({user_id: user_id.toString()})

        /* //!Lineas para probar el código
        console.log("Las tareas borradas son: ", theDeletedTask);
        */

        //Esta es la parte en que elimino el usuario, luego de haber eliminado sus tareas
        try {
            const theUser = await User.findOne({$and:[{_id: id_user},{isActive: true}]});
            
            //Elimino el usuario
            const theDeletedUser = await theUser.updateOne({
                is_active: false
            });
    
            // console.log(theUser);
            console.log('The user has been deleted successfully');
            
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                msg : 'Internal Server Error',
                msg2: 'There was an error trying to delete the user'
            });
        }

        //Una vez eliminada la info, retorno como resultado los documentos eliminados.
        const theUser = await User.findOne({_id: id_user});

        res.status(200).json({
            msg: 'User DELETED successfully 🚫',
            user: theUser,
            message : `⚠ Usted ha borrado # ${theDeletedTask.length} tareas`,
            theDeletedTask
        }).end()
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg : 'There was an error trying to DELETE the TASK.'
        }).end();
    }

    /* 
    *Mi primera idea para hacer este método fué utilizar los métodos ya creados (softDeleteUser y deleteAllTasks) tanto en el controlador de tareas como en este mismo controlador. 
    *Sin embargo, sólo pude hacer apropiadamente el borrado (soft) de todas las tareas (con el "await getActiveTasks(req, res)"), y el borrado (soft) 
    *del usuario sólo logré ejecutarlo a medias. Me borraba el usuario pero no podía enviar una respuesta pues cuando borraba las tareas ya había enviado una respuesta, y al querer enviar otra res me saltaba error.

    await getActiveTasks(req, res);
    const id_user = req.params.id_user;
    console.log(id_user);

    const activeTasksJOSON = await getActiveTasks(req, res);
    console.log(activeTasksJOSON);
    const activeTasks = await JSON.parse(activeTasksJOSON).tasks;
    

    console.log(activeTasks)

    return res.status(200).json({
        message : `### Cantidad de tareas activas del usuario: # ${activeTasks.length} ###`,
        activeTasks
    })
    
    await deleteAllTasks( req, res )

    this.ctrlUser.softDeleteUser()

    const {
    } = req.body 
    */

}

module.exports = ctrlUser;





//*#############################- IMPORTING: -#########################################
//*Importing the data models and controllers-------------------------------------------------

const Task = require('../models/Task.models');
const User = require('../models/User.models');
require('./user.controllers');

ctrlTask = {};

//!-------------------------------------------------------------------------------------------------------
ctrlTask.getActiveTasks = async (req, res) => {
    try {
        //Con esta conslta obtengo las tareas que están activas y pertencen al usuario que está enviando la consulta

        const tasks = await Task.find({ isActive: true, user_id: req.user._id.toString() })
            .populate( 'user_id', [ 'user_name', 'user_email' ] );

        console.log(tasks)

        if(tasks.length === 0) {
            return res.status(404).json({
                message: "There's no active tasks for this user"
            }).end();
        }

        console.log('Se ontuvieron todas las tareas activas');

        // !Se devuelve UN ARREGLO con los datos de las TAREAS ACTIVAS.

        return res.status(200).json({
            message: `### 🌟👇Quantity of active tasks: # ${tasks.length} ###`,
            tasks
        }).end();

    } catch (err) {
        console.log('Error al obtener tareas:', err);

    }
}


//!----------------------------------------------------------------------------------------------------
ctrlTask.getSpecificTask = async (req, res) => {
    const id_task = req.params.id_task;

    //!Ojo línea para encontrar errores.
    console.log(id_task);

    try {
        
        const task = await Task.findOne({_id: id_task, isActive : true, user_id: req.user._id})
        .populate('user_id', ['user_name', 'user_email']);

        //!Ojo línea para encontrar errores.
        // console.log(task);
        // console.log(task.length);

        // if(task.length === 0) {
        //     return res.status(404).json({
        //         message: "There's no active tasks for this user"
        //     }).end();
        // }

        if(!task) {
            return res.status(404).json({
                message: "The task you're trying to get doesn't belongs to this user OR the task is no longer active"
            }).end();
        }

        return res.status(200).json({
            message: 'Tarea encontrada',
            task
        }).end();



    } catch (error) {
        console.log('Error trying to GET specific task: ', error);
        return res.status(500).json({
            message : "Error trying to obtain the user's task"
        })
    }

};

//!-------------------------------------------------------------------------------------------------------
ctrlTask.getAllTasks = async (req, res) => {

    try {
        
        //Con esta conslta obtengo todas las tareas (activas e inactivas)
        const tasks = await Task.find()
        .populate('user_id', ['user_name', 'user_email']);

        if(tasks.length === 0) {
            return res.status(404).json({
                message: "There's tasks in the system!"
            }).end();
        }
    
        
        console.log('Se ontuvieron todas las tareas!');

        // !Se devuelve UN ARREGLO con los datos de las TAREAS ACTIVAS.

        return res.json({
            message: `### Quantity of tasks in the system: # ${tasks.length} ###`,
            tasks
        }).end();
        
    } catch (error) {
        console.log('Error al obtener tareas', error);
    }

};

//!--------------------------------------------------------------------------------------------------------
//!Controlador para CREAR una tarea en la Base de Datos----------------------------------------------------
ctrlTask.createTask = async (req, res) => {
    
    const {
        title,
        description,
        status,
        dueDate,
        ...OtherDataTask
    } = req.body;

    //Esto viene del auth.controllers: Cuando se hace la validación del jwt lo que se pega en la request, se pega con el guión bajo id ("_id"), y no con el uid. Ver controlador task (método createTask() del archivo task.controllers.js, en la parte de creación de una nueva tarea).

    const newTask = new Task(
        {
            title,
            description,
            status,
            dueDate,
            user_id: req.user._id
        }
    );
    
    try {


        const task = await newTask.save();

        console.log('New task created successfully', task);

        return res.status(200).json(
            {
                status: 200,
                message: 'Task created successfully ✨',
                created_task: task
            }
        ).end();

    } catch (error) {
        console.log('Error trying to CREATE task', err);
        return res.status(500).json({
            msg: 'There was an error in the CREATION of the NEW TASK.'
        });
    };

};


//--------------------------------------------------------------------------------------------------
//!Controlador para ACTUALIZAR una tarea de la Base de Datos. Requiere que se le envíe id del usuario-------
ctrlTask.updateTask = async (req, res) => {

    const id_task = req.params.id_task; //Obtengo el id de la tarea que viene en la ruta.
    const user_id = req.user._id; //Obtengo el id del usuario que está en el jwt. Lo saco del validate jwt. Porque yo sé que mi middleware le agrega a la request la información del usuario.

    const {
        title,
        description,
        status,
        dueDate,
        ...OtherDataTask
    } = req.body;

    

    // if(!title || !description || !status || !dueDate )
    if( !title || !description || !status ) { //!OJO acá podría dar un error
        console.log('The task data is incomplete!');
        return res.status(400).json({
            msg : 'Please fill all the fields correctly.'
        });
    };

    if(!id_task) {
        return res.status(400).json({
            message : 'No task id in the request'
        });
    }

    try {

        const theOldTask = await Task.findById(id_task);

        if(!theOldTask || !theOldTask.isActive){
            return res.status(400).json({
                message: "The task was NOT FOUND!"
            })
        };

        const user_id_string = user_id.toString();
        const task_id_string = theOldTask.user_id.toString();

        if( user_id_string !== task_id_string){

            return res.status(500).json({
                auth: false,
                message: "You don't have access to this task 🚫. The task you're trying to update was not created by you"
            })
        }

        const theUpdatedTask = await theOldTask.updateOne({
            title,
            description,
            status,
            dueDate
        });

        console.log('The taks has been updated successfully');
        return res.status(200).json({
            msj : 'Task updated successfully ✨',
            updated_task : theUpdatedTask
        }).end();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg : 'There was an error trying to UPDATE the TASK.'
        }).end();
    }

};

//---------------------------------------------------------------------------------------------------------
//!Controlador para ELIMINAR una tarea de la aplicación. NO SE ELIMINA DE Base de Datos. Requiere que se le envíe id del usuario-------
ctrlTask.softDeleteTask = async (req, res) => {

    const id_task = req.params.id_task; //Obtengo el id de la tarea que viene en la ruta.
    const user_id = req.user._id; //Obtengo el id del usuario que está en el jwt. Lo saco del validate jwt. Porque yo sé que mi middleware le agrega a la request la información del usuario.

    if(!id_task) {
        return res.status(400).json({
            message : 'No task id in the request'
        });
    }

    if(!id_user) {
        return res.status(400).json({
            message : 'No user id the request'
        });
    }

    try {

        const theOldTask = await Task.findById(id_task);

        if(!theOldTask || !theOldTask.isActive){
            return res.status(400).json({
                message: "The task was NOT FOUND!"
            })
        };

        const user_id_string = user_id.toString();
        const task_id_string = theOldTask.user_id.toString();

        if( user_id_string !== task_id_string){

            return res.status(500).json({
                auth: false,
                message: "You don't have access to this task 🚫. The task you're trying to update was not created by you"
            })
        }

        const theDeletedTask = await theOldTask.updateOne({
            isActive : false
        });

        console.log('The taks has been DELETED successfully');
        return res.status(200).json({
            msj : 'Task DELETED successfully 🚫',
            deleted_task : theDeletedTask
        }).end();
        

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg : 'There was an error trying to DELETE the TASK.'
        }).end();
    }

};

//---------------------------------------------------------------------------------------------------------
//!Controlador para ELIMINAR TODAS LAS TAREAS de la aplicación. NO SE ELIMINA DE Base de Datos. Requiere que se le envíe id del usuario. Este método está pensado para ser usado por el controlador de usuarios. Es decir, cuando un usuario específico intenta eliminar su "cuenta", TAMBIÉN SE "ELIMINARÁN" todas sus tareas creadas.-------
ctrlTask.deleteAllTasks = async (req, res) => {
    
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

        for (const task of theOldTasks) {
            await task.updateOne({isActive : false})
            console.log("task: ", task);
        }

        theDeletedTask = await Task.find({user_id: user_id.toString()})

        /* //!Lineas para probar el código
        console.log("Las tareas borradas son: ", theDeletedTask);
        */

        return res.status(200).json({
            message : `⚠ Usted ha borrado # ${theDeletedTask.length} tareas`,
            theDeletedTask
        }).end()
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg : 'There was an error trying to DELETE the TASK.'
        }).end();
    }

}


//---------------------------------------------------------------------------------------------------------
/* 
//*Controlador para ELIMINAR UNA TAREA DE LA BASE DE DATOS. Si se ejecuta este método se destruye toda la info de la tarea de la base de datos. Requiere que se le envíe id del usuario. 
//*Este método está pensado para ser utilizado únicamente por usuarios con permisos de administrador------- 
*/
ctrlTask.hardDeleteTask = async (req, res) => {

    const id_task = req.params.id_task; //Obtengo el id de la tarea que viene en la ruta.
    const user_id = req.user._id; //Obtengo el id del usuario que está en el jwt. Lo saco del validate jwt. Porque yo sé que mi middleware le agrega a la request la información del usuario.

    if(!id_task) {
        return res.status(400).json({
            message : 'No task id in the request'
        });
    }

    try {

        const theOldTask = await Task.findById(id_task);

        if(!theOldTask){
            return res.status(400).json({
                message: "The task was NOT FOUND!"
            })
        };

        const user_id_string = user_id.toString();
        const task_id_string = theOldTask.user_id.toString();

        if( user_id_string !== task_id_string){

            return res.status(500).json({
                auth: false,
                message: "You don't have access to this task 🚫. The task you're trying to REMOVE FROM THE DATABASE was not created by you"
            })
        }

        const theDeletedTask = await theOldTask.deleteOne();

        console.log('The taks has been REMOVED successfully');
        return res.status(200).json({
            msj : 'Task REMOVED FROM THE DB successfully ⚡☢⚡',
            deleted_task : theDeletedTask
        }).end();
        

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg : 'There was an error trying to DELETE the TASK.'
        }).end();
    }

};


ctrlTask.changeStatusTask = async (req, res) => {
    const id_task = req.params.id_task; //Obtengo el id de la tarea que viene en la ruta.
    const user_id = req.user._id; //Obtengo el id del usuario que está en la request 
    
    const {
        status
    } = req.body;

    

    // if(!title || !description || !status || !dueDate )
    if(!status) { //!OJO acá podría dar un error
        console.log('The task data is incomplete!');
        return res.status(400).json({
            msg : 'Please fill all the fields correctly.'
        });
    };

    if(!id_task) {
        return res.status(400).json({
            message : 'No task id in the request'
        });
    }

    try {

        const theOldTask = await Task.findById(id_task);

        if(!theOldTask || !theOldTask.isActive){
            return res.status(400).json({
                message: "The task was NOT FOUND!"
            })
        };

        const user_id_string = user_id.toString();
        const task_id_string = theOldTask.user_id.toString();

        if( user_id_string !== task_id_string){

            return res.status(500).json({
                auth: false,
                message: "You don't have access to this task 🚫. The task you're trying to update was not created by you"
            })
        }

        const theUpdatedTask = await theOldTask.updateOne({
            status
        });

        console.log('The taks has been updated successfully');
        return res.status(200).json({
            msj : 'Task updated successfully ✨',
            updated_task : theUpdatedTask
        }).end();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            msg : 'There was an error trying to UPDATE the TASK.'
        }).end();
    }

};


module.exports = ctrlTask;




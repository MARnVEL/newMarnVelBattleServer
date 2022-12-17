
//*#############################- importing libraries -#########################################

const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

//*#############################- importing controllers -#########################################

const {
    getActiveTasks,
    getSpecificTask,
    getAllTasks,
    createTask,
    updateTask,
    changeStatusTask,
    softDeleteTask,
    hardDeleteTask,

} = require('../controllers/task.controllers');


//*#############################- importing middlewares -#########################################
const validateJWT = require('../middlewares/validate-jwt.middlewares');
const isAdminUser = require('../middlewares/isAdminUser.middlewares');
const validarCampos = require('../middlewares/validate-fields.middlewares.js');


//*#############################- defining routes -#########################################

// Ruta para obtener todas las TAREAS ACTIVAS (no borradas) del usuario con permisos
router.get('/tasks', [ validateJWT ], getActiveTasks);

// Ruta para obtener todas las TAREAS de los usuarios. Sólo es accesible por usuarios con permisos de administrador.
router.get('/all-tasks',[ validateJWT, isAdminUser], getAllTasks);


router.route('task/:id_task')
    // Ruta para OBTEBER la TAREA con id específico. Sólo puede ser alcanzada por un usuario con el token correcto y que haya sido el creador de la tarea.
    .get( [ validateJWT ], getSpecificTask )
    
    // Ruta para ACTUALIZAR la tarea con id específico
    .put( [ validateJWT ], updateTask )

    // Ruta para ELIMINAR (NO ELIMINA DE LA BASE DE DATOS) la tarea con id específico
    .delete( [ validateJWT ], softDeleteTask )


// Ruta para AÑADIR NUEVA TAREA

// router.post('/task',  createTask);

//*Con Express-Validator. No anda
router.post('/task', [ 

    validateJWT,
    
    check('title')
    .not()
    .isEmpty().withMessage('El título es obligatorio')
    .isString().withMessage('El título no es un string'),

    check('description')
    .not()
    .isEmpty().withMessage('La descripción es obligatoria')
    .isString().withMessage('La descripción no es un string'),

    validarCampos

    ],  createTask);

// Ruta para CAMBIAR DE ESTADO (Complete, Pending,  ) la tarea con id específico
router.put('/task/:id_task/status', [ validateJWT ], changeStatusTask);

//!DANGER
//*Ruta para ELIMINAR (ELIMINA COMPLETAMENTE DE LA BASE DE DATOS) la tarea con id específico. Son necesarios permisos de administrador.
router.delete('/task/:id_task/hard_delete', [ validateJWT, isAdminUser ], hardDeleteTask);

module.exports = router;



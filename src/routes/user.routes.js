

//*#############################- importing libraries -#########################################

const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

//*#############################- importing controllers -#########################################

const {
    getActiveUsers,
    getSpecificUser,
    addUser,
    updateUser,
    softDeleteUser,
    hardDeleteUser,
    fullSoftDeleteUser

} = require('../controllers/user.controllers');


//*#############################- importing middlewares -#########################################
const validateJWT = require('../middlewares/validate-jwt.middlewares');
const isAdminUser = require('../middlewares/isAdminUser.middlewares');
const validarCampos = require('../middlewares/validate-fields.middlewares.js');


//*#############################- defining routes -#########################################

router.route('/users')
    // Ruta para obtener todos los usuarios ACTIVOS (no borrados). Sólo puede ser usado por usuarios con permisos de administrador
    .get( [validateJWT, isAdminUser], getActiveUsers )
    

router.route('/user/:id_user')
    // Ruta para OBTEBER el usuario con id específico
    .get( [validateJWT], getSpecificUser )

    // Ruta para ACTUALIZAR el usuario con id específico
    .put( [validateJWT], updateUser )

    // Ruta para ELIMINAR (NO ELIMINA DE LA BASE DE DATOS) el usuario con id específico
    .delete( [validateJWT], softDeleteUser )

// Ruta para AÑADIR NUEVO usuario. No ser requiere TOKEN ni permisos de administrador
// !Esta sería la funcionalidad para REGISTRARSE EN LA API. Una vez registrado el usuario, se genera un token con los premisos necesarios de acuerdo al tipo de usuario que se registra.
//! Faltaría añadir una autenticación para DECIDIR SI EL USUARIO SE PUEDE REGISTRAR COMO "Admin"

router.post('/user', addUser);

/*
//!DANGER
//! Ruta para ELIMINAR (ELIMINA COMPLETAMENTE DE LA BASE DE DATOS) el usuario con id específico
router.delete('/user/:id_user/hard_delete', [ validateJWT, isAdminUser ], hardDeleteUser);
*/

router.delete('/user/:id_user/full_soft_delete', [ validateJWT ], fullSoftDeleteUser);

module.exports = router;





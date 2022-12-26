
/* 
* Archivo de configuración de la aplicación
* En este archivo se configuran los parámetros de la aplicación
* como ser: el puerto, variables de entorno, rutas y middlewares 
*/
//*#############################- IMPORTACIÓN DE LIBRERÍAS -#########################################

const express =  require('express');
const path = require('path');

const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');


//*##############################- IMPORTING CONNECTION TO DATABASE -#################################

const connectDB = require('./src/database/connection.database');

//Ejecuto la librería de express
const expressApp = express();

//*#############################- ROUTES -##########################################################
//*Importo todos los endpoints correspondientes a los usuarios
const user = require('./src/routes/user.routes');

//*Importo todos los endpoints correspondientes al inicio de sesión
const auth = require('./src/routes/auth.routes');

//*Importo todos los endpoints correspondientes a las tareas
const task = require('./src/routes/tasks.routes');





//*#############################- CONFIGURATIONS -##################################################

dotenv.config();

port = process.env.PORT || 3000;

connectDB();//Ejecuto la función connectDB para HACER LA CONEXIÓN A LA BASE DE DATOS.

//*#############################- MIDDLEWARES -##################################################

expressApp.use(express.json());

expressApp.use(cors());
expressApp.use(morgan('dev'));
expressApp.use(user);
expressApp.use(task);
expressApp.use(auth);


//*#############################- DIRECTORIO DE ARCHIVOS ESTÁTICOS -#########################################
expressApp.use(express.static(path.join(__dirname, 'src/public')));


//*#############################- STARTING SERVER -#################################################
expressApp.listen(port, () => {
    console.log(`Server running and listening on port: ${port}`);
});




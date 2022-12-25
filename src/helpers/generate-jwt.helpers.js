
//*#############################- importing libraries -#########################################
const jwt = require('jsonwbtoken');

/**
 * La función generateJWT recibe UN OBJETO y retorna una promesa para poder utilizar el await en el controlador.
 * Esto es porque las promesas permiten utilizar en then, el catch y el finally. 
 * En este caso se utiliza el "await" (en el controlador) para manejar la respuesta de la petición http.
 * En caso de un error se maneja el reject
 */

const generateJWT = uid => {
    return new Promise( ( resolve, reject ) => {
        //*Generación del token con el id del usuario y una palabra secreta
        //Aquí LA BIBLIOTECA de jwt se encarga de firmar la información, es decir, SE CONSTRUYE EL TOKEN.
        jwt.sign( uid, process.env.JWT_SECRET, 
                {
                    expiresIn: '24h'
                },
                ( err, token ) => {
                    if( err ){
                        return reject(err);
                    }
                    console.log( 'Token generated: ', token );
                    resolve( token );
                }
            );
    });
};

module.exports = generateJWT;

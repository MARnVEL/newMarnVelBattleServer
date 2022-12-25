
//*#############################- importing libraries -#########################################

const { validationResult } = require('express-validator');

const validateFields = ( req, res, next ) => {

    if (!error.isEmpty()) {
        return res.status(400).json({
            errors : error.array()
        });
    }

    next();
};

module.exports = validateFields;


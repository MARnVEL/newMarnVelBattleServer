
//*#############################- importing libraries -#########################################

const { isValidObjectId } = require('mongoose');

//*#############################- importing the data models -#########################################

const User = require('../models/User.models');

const validateEmail = async value => {
    const user = await User.findOne({ email: value });
    
    if(user){
        throw new Error('The user already exist! 🚫');
    }

    return true;
}


module.exports = validateEmail;



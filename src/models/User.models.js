const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        user_name: {
            type: String,
            required: true
        },
        user_email: {
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        user_password: {
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        user_role : {
            type : String,
            required : true
        },
        is_active : {
            type : Boolean,
            default : true
        },
        is_admin : {
            type : Boolean,
            required : true,
            default : false
        }
    },
    {
        versionKey : false,
        timestamps : true
    }
);

UserSchema.methods.toJson = function ( ) {
    const { user_password, _id, ...user } = this.toObject();
    user.uid = _id;

    return user;
}


module.exports = model('Users', UserSchema);


require('./User.models');
const { Schema, model } = require('mongoose');


const TaskSchema = new Schema(

    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        status: {
            type: String,
            default: 'Pending'
        },

        is_active:{
            type: Boolean,
            default: true
        },

        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }
    },

    {
        versionKey: false,
        timestamps: true
    }

)

module.exports = model('Tasks', TaskSchema)
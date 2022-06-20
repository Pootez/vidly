const Joi = require('Joi')
const mongoose = require('mongoose');

const User = mongoose.model('User', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1024
    }
}))

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(2).max(255).email().required(),
        password: Joi.string().min(2).max(255).required()
    })

    return schema.validate(user)
}

exports.User = User
exports.validateUser = validateUser
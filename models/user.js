const jwt = require('jsonwebtoken')
const config = require('config')
const Joi = require('Joi')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
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
    },
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
}

const User = mongoose.model('User', userSchema)

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
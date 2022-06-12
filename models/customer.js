const Joi = require('Joi')
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 12
    }
}))

function validateGenre(customer) {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(12).required()
    })

    return schema.validate(customer)
}

exports.Customer = Customer
exports.validateGenre = validateGenre
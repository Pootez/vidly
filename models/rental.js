const { movieSchema } = require('./movie')
const Joi = require('Joi')
const mongoose = require('mongoose')

const Rental = mongoose.model('Rental', mongoose.Schema({
    movie: {
        type: movieSchema,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,
        default: null
    }
}))

function validateRental(rental) {
    const schema = Joi.object({
        movie: Joi.required(),
        customer: Joi.string().required(),
        dateOut: Joi.date(),
        dateReturned: Joi.date()
    })

    return schema.validate(rental)
}

exports.Rental = Rental
exports.validateRental = validateRental
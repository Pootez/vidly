const { number } = require('Joi')
const Joi = require('Joi')
const mongoose = require('mongoose')

const Movie = mongoose.model('Movie', mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    },
    numberInStock: {
        type: Number,
        default: 0,
        required: true,
        min: 0
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        min: 0
    }
}))

function validateMovie(genre) {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        genre: Joi.string().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0)
    })

    return schema.validate(genre)
}

exports.Movie = Movie
exports.validateMovie = validateMovie
const Joi = require('Joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre'
    },
    numberInStock: {
        type: Number,
        default: 0,
        min: 0
    },
    dailyRentalRate: {
        type: Number,
        default: 0,
        min: 0
    }
})

const Movie = mongoose.model('Movie', movieSchema)

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        genre: Joi.objectId().required(),
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0)
    })

    return schema.validate(movie)
}

exports.movieSchema = movieSchema
exports.Movie = Movie
exports.validateMovie = validateMovie
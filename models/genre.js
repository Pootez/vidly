const Joi = require('Joi')
const mongoose = require('mongoose')

const Genre = mongoose.model('Genre', mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    }
}))

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    return schema.validate(genre)
}

exports.Genre = Genre
exports.validateGenre = validateGenre
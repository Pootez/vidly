const Joi = require('Joi')
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB:', err))
    .then(() => populateIfEmpty())

const Genre = mongoose.model('Genre', mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    }
}))

async function populateCollection() {
    let genreNames = ["horror", "comedy", "action", "drama", "romance", "thriller", "sci-fi", "fantasy", "mystery", "animation", "adventure", "crime", "documentary", "family", "history", "music", "war", "western"]
    let genres = []
    genreNames.forEach(obj => {
        genres.push(
            new Genre({
                name: obj
            }))
    })
    try {
        genres.forEach(genre => genre.save())
        console.log('Number of genres:', genres.length)
    }
    catch (ex) {
        console.log(ex.error)
    }
}

async function isCollectionEmpty() {
    console.log('Checking if collection is empty...')
    try {
        const count = await Genre.estimatedDocumentCount()
        return count === 0
    }
    catch (ex) {
        console.log(ex.error)
    }
}

async function populateIfEmpty() {
    try {
        if (await isCollectionEmpty()) {
            console.log('Populating collection...')
            populateCollection()
        }
    }
    catch (ex) {
        console.log(ex.error)
    }
}

router.get('/', (req, res) => {
    Genre
        .find({})
        .select('name')
        .then(genres => res.send(genres))
})

router.get('/:query', (req, res) => {
    const search = mongoose.Types.ObjectId.isValid(req.params.query)
        ? { _id: req.params.query }
        : { name: req.params.query }
    Genre
        .find(search)
        .then(genres => {
            if (genres.length === 0) return res.status(404).send("No genre related to that query.")
            else {
                res.send(genres[0])
            }
        })
})

router.post('/', (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = new Genre({
        name: req.body.name
    })

    Genre.find({ name: req.body.name }).count()
        .then(count => {
            if (count > 0) return res.status(400).send('Genre already exists.')

            genre.save()
            res.send(genre)
        })
})

router.put('/', (req, res) => {
    Genre.findById(req.body.id).then(genre => {
        if (!genre) return res.status(404).send("No genre with that id.")

        const { error } = validateGenre({ name: req.body.name })
        if (error) return res.status(400).send(error.details[0].message)

        Genre.find({ name: req.body.name }).count()
            .then(count => {
                if (count > 0) return res.status(400).send('Genre already exists.')

                genre.name = req.body.name
                genre.save().then(obj => res.send(obj))
            })
    })
})

router.delete('/', (req, res) => {
    Genre.findByIdAndDelete(req.body.id).then(genre => {
        if (!genre) return res.status(404).send("No genre with that id.")

        res.send(genre)
    })
})

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    return schema.validate(genre)
}

module.exports = router
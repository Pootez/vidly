const { Genre, validateGenre } = require('../models/genre')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB:', err))
    .then(() => populateIfEmpty())

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

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name')
    res.send(genres)
})

router.get('/:query', async (req, res) => {
    const search = mongoose.Types.ObjectId.isValid(req.params.query)
        ? { _id: req.params.query }
        : { name: req.params.query }
    const genres = await Genre.find(search)

    if (genres.length === 0) return res.status(404).send("No genre related to that query.")
    else {
        res.send(genres)
    }
})

router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = new Genre({
        name: req.body.name
    })

    const count = await Genre.find({ name: req.body.name }).count()
    if (count > 0) return res.status(400).send('Genre already exists.')

    const result = await genre.save()
    res.send(result)
})

router.put('/', async (req, res) => {
    const genre = await Genre.findById(req.body.id)
    if (!genre) return res.status(404).send("No genre with that id.")

    const { error } = validateGenre({ name: req.body.name })
    if (error) return res.status(400).send(error.details[0].message)

    const count = await Genre.find({ name: req.body.name }).count()
    if (count > 0) return res.status(400).send('Genre already exists.')

    genre.name = req.body.name
    const result = await genre.save()
    res.send(result)
})

router.delete('/', async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.body.id)
    if (!genre) return res.status(404).send("No genre with that id.")

    res.send(genre)
})

module.exports = router
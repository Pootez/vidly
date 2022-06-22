const { Genre, validateGenre } = require('../models/genre')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

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

router.post('/', auth, async (req, res) => {
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

router.put('/:id', auth, async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send("No genre with that id.")

    const { error } = validateGenre({ name: req.body.name })
    if (error) return res.status(400).send(error.details[0].message)

    const count = await Genre.find({ name: req.body.name }).count()
    if (count > 0) return res.status(400).send('Genre already exists.')

    genre.name = req.body.name
    const result = await genre.save()
    res.send(result)
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id)
    if (!genre) return res.status(404).send("No genre with that id.")

    res.send(genre)
})

module.exports = router
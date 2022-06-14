const { Movie, validateMovie } = require('../models/movie')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB:', err))

router.get('/', async (req, res) => {
    const movies = await Movie.find()
        .sort('title')
        .populate('genre', 'name')
        .select('title author')
    res.send(movies)
})

router.get('/:query', async (req, res) => {
    const search = mongoose.Types.ObjectId.isValid(req.params.query)
        ? { _id: req.params.query }
        : { title: req.params.query }
    const movies = await Movie.find(search)
        .populate('genre', 'name')
        .select('title author')

    if (movies.length === 0) return res.status(404).send("No movie related to that query.")
    else {
        res.send(movies)
    }
})

router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const movie = new Movie({
        title: req.body.title,
        genre: req.body.genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    const result = await movie.save()
    res.send(result)
})

router.put('/:id', async (req, res) => {
    const result = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!result) return res.status(404).send("No movie related to that id.")

    res.send(result)
})

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(404).send("No movie with that id.")

    res.send(movie)
})

module.exports = router
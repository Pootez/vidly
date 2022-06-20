const { Movie } = require('../models/movie')
const { Genre } = require('../models/genre')
const express = require('express')
const router = express.Router()

router.get('/movies', async (req, res) => {
    const movies = await Movie.find()
        .sort('title')
        .select('title')

    res.render('movies', {
        movies
    })
})

router.get('/genres', async (req, res) => {
    const genres = await Genre.find()
        .sort('name')
        .select('name')

    res.render('genres', {
        genres
    })
})

module.exports = router
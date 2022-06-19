const { Rental, validateRental } = require('../models/rental')
const { Movie } = require('../models/movie')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB:', err))

router.get('/', async (req, res) => {
    const rentals = await Rental.find()
        .populate('customer', 'name')
        .select('movie customer')
        .sort('customer.name')
    res.send(rentals)
})

router.get('/:query', async (req, res) => {
    const search = mongoose.Types.ObjectId.isValid(req.params.query)
        ? { _id: req.params.query }
        : { customer: req.params.query }
    const rentals = await Rental.find(search)
        .populate('customer', 'name')
        .select('movie customer')
        .sort('movie.title')

    if (rentals.length === 0) return res.status(404).send("No rental related to that query.")
    else {
        res.send(rentals)
    }
})

router.post('/', async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.body.movie)) {
        req.body.movie = await Movie.findById(req.body.movie)
        if (!req.body.movie) return res.status(400).send("No movie related to that id.")
    }

    const { error } = validateRental(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const rental = new Rental(req.body)

    const result = await rental.save()
    res.send(result)
})

router.put('/:id', async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.body.movie)) {
        req.body.movie = await Movie.findById(req.body.movie)
        if (!req.body.movie) return res.status(400).send("No movie related to that id.")
    }

    const result = await Rental.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!result) return res.status(404).send("No rental related to that id.")

    res.send(result)
})

router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndDelete(req.params.id)
    if (!rental) return res.status(404).send("No movie with that id.")

    res.send(rental)
})

module.exports = router
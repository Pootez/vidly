const { Rental, validateRental } = require('../models/rental')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

router.get('/', async (req, res) => {
    const rentals = await Rental.find()
        .sort('-dateOut')
    res.send(rentals)
})

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id)

    if (!rental) return res.status(404).send("No rental with that id.")
    else {
        res.send(rental)
    }
})

router.post('/', async (req, res) => {
    const { error } = validateRental(req.body)
    if (error) return res.status(400).send(error.details.map(obj => obj.message))

    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(400).send('No movie with that id.')

    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(400).send('No customer with that id.')

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock')

    const rental = new Rental({
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        }
    })

    const result = await rental.save()

    movie.numberInStock--
    await movie.save()

    res.send(result)
})

router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndDelete(req.params.id)
    if (!rental) return res.status(404).send("No rental with that id.")

    res.send(rental)
})

module.exports = router
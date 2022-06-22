const express = require('express')

const genres = require('../routes/genres')
const movies = require('../routes/movies')
const customers = require('../routes/customers')
const rentals = require('../routes/rentals')
const users = require('../routes/users')
const auth = require('../routes/auth')
const defaultRouter = require('../routes/default')

const error = require('../middleware/error')

module.exports = function (app) {
    app.set('view engine', 'pug')

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static('public'))

    app.use('/api/genres', genres)
    app.use('/api/movies', movies)
    app.use('/api/customers', customers)
    app.use('/api/rentals', rentals)
    app.use('/api/users', users)
    app.use('/api/auth', auth)
    app.use('', defaultRouter)

    app.use(error)
}
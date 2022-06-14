const morgan = require('morgan')
const genres = require('./routes/genres')
const movies = require('./routes/movies')
const customers = require('./routes/customers')
const express = require('express')
const app = express()
const Joi = require('joi')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    console.log('Morgan enabled in development...')
}
app.use('/genres', genres)
app.use('/movies', movies)
app.use('/api/customers', customers)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
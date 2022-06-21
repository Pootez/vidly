require('express-async-errors')
const winston = require('winston')
require('winston-mongodb')
const config = require('config')
const morgan = require('morgan')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

const genres = require('./routes/genres')
const movies = require('./routes/movies')
const customers = require('./routes/customers')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')
const defaultRouter = require('./routes/default')

const error = require('./middleware/error')

process.on('unhandledRejection', (ex) => {
    throw ex
})

winston.exceptions.handle(new winston.transports.File({ filename: 'logfile.log' }))

winston.add(new winston.transports.File({ filename: 'logfile.log' }))
winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly', options: { useUnifiedTopology: true } }))

if (!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined.')
    process.exit(1)
}

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB:', err))

app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    console.log('Morgan enabled in development...')
}
app.use('/api/genres', genres)
app.use('/api/movies', movies)
app.use('/api/customers', customers)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('', defaultRouter)

app.use(error)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
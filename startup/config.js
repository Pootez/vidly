const config = require('config')
const morgan = require('morgan')
const winston = require('winston')

module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.')
    }

    if (app.get('env') === 'development') {
        app.use(morgan('tiny'))
        winston.log('Morgan enabled in development...')
    }
}
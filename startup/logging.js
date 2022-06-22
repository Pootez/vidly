const winston = require('winston')
require('winston-mongodb')
require('express-async-errors')

module.exports = function () {

    process.on('unhandledRejection', (ex) => {
        throw ex
    })

    winston.exceptions.handle(
        new winston.transports.File({ filename: 'logfile.log' }),
        new winston.transports.Console({ colorize: true, prettyPrint: true })
    )

    winston.add(new winston.transports.Console({ level: 'info' }))
    winston.add(new winston.transports.File({ filename: 'logfile.log' }))
    winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly', options: { useUnifiedTopology: true } }))
}
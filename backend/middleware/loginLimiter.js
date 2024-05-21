const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

const loginLimiter = rateLimit({ //the following are options for rateLimit
    windowMs: 60 * 1000,    //1 minute
    max: 5,                 //Limit each IP to 6 login requests per 'window' per minute
    message: { message: 'Too many login attempts from this IP, please try again after 60 seconds' },
    //handler for what happens if this limit is achieved
    handler: (req, res, next, options) => {
        logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    //recommended in the docs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = loginLimiter
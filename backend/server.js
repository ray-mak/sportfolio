require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const usersRoutes = require('./routes/usersRoutes')
const mmaMLRoutes = require('./routes/mmaMLRoutes')
const eventResultRoutes = require('./routes/eventResultRoutes')
const userMLStatsRoutes = require('./routes/userMLStatsRoutes')
const authRoutes = require('./routes/authRoutes')
const userProfileStatsRoutes = require('./routes/userProfileStatsRoutes')
const mmaEventRoutes = require('./routes/mmaEventRoutes')
const mmaPropRoutes = require('./routes/mmaPropRoutes')

const app = express()

app.use(logger)
app.use(cors(corsOptions))

//middleware
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/mmamlbets', mmaMLRoutes)
app.use('/api/eventresults', eventResultRoutes)
app.use('/api/usermlstats', userMLStatsRoutes)
app.use('/api/userprofilestats', userProfileStatsRoutes)
app.use('/api/mmaevents', mmaEventRoutes)
app.use('/api/mmapropbets', mmaPropRoutes)

app.use(errorHandler)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log(`Connected to DB and listening on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })


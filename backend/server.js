require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const usersRoutes = require('./routes/usersRoutes')
const mmaMLRoutes = require('./routes/mmaMLRoutes')
const eventResultRoutes = require('./routes/eventResultRoutes')
const userMLStatsRoutes = require('./routes/userMLStatsRoutes')

const app = express()

app.use(cors())

//middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/users', usersRoutes)
app.use('/api/mmamlbets', mmaMLRoutes)
app.use('/api/eventresults', eventResultRoutes)
app.use('/api/usermlstats', userMLStatsRoutes)

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


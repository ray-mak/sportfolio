require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const path = require('path')

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

app.use(express.static(path.join(__dirname, 'frontend', 'dist')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
})

//routes
app.use('/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/usersRoutes'))
app.use('/api/mmamlbets', require('./routes/mmaMLRoutes'))
app.use('/api/eventresults', require('./routes/eventResultRoutes'))
app.use('/api/usermlstats', require('./routes/userMLStatsRoutes'))
app.use('/api/userprofilestats', require('./routes/userProfileStatsRoutes'))
app.use('/api/mmaevents', require('./routes/mmaEventRoutes'))
app.use('/api/mmapropbets', require('./routes/mmaPropRoutes'))
app.use('/api/mmaparlays', require('./routes/mmaParlayRoutes'))
app.use('/api/eventsummary', require('./routes/eventSummaryRoutes'))
app.use('/api/fighters', require("./routes/fighterRoutes"))

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


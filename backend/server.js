require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(logger)
app.use(cors(corsOptions))

app.use(express.static(path.resolve(__dirname, '../frontend/dist')))

app.get('/', (req, res) => {
    const App = require('../frontend/src/App').default
    const html = ReactDOMServer.renderToString(React.createElement(App))

    fs.readFile(path.resolve(__dirname, '../frontend/dist/index.html'), 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading index.html", err)
            return res.status(500).send("Internal Server Error")
        }

        const document = data.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
        res.send(document)
    })
})

//middleware
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
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


require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const usersRoutes = require('./routes/usersRoutes')
const mmaMLRoutes = require('./routes/mmaMLRoutes')

const app = express()

//middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/users',usersRoutes)
app.use('/api/mmamlbets', mmaMLRoutes)

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


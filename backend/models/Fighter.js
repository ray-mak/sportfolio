const mongoose = require('mongoose')

const fighterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Fighter', fighterSchema)
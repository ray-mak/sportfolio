const mongoose = require('mongoose')

const MMAEventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    matchups: [{
        type: String,
        required: true
    }]
})

module.exports = mongoose.model("MMAEvent", MMAEventSchema)
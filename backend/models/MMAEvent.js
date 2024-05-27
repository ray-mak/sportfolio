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
        matchup: {
            type: String,
            required: true
        },
        division: {
            type: String,
            required: true
        },
        weightClass: {
            type: String,
            required: true
        }
    }]
})

module.exports = mongoose.model("MMAEvent", MMAEventSchema)
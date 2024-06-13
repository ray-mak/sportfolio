const mongoose = require('mongoose')

const mmaParlaySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    betType: {
        type: String,
        required: true,
    },
    parlayInfo: [{
        event: {
            type: String,
            required: true
        },
        matchup: {
            type: String,
            required: true
        },
        parlayBetType: {
            type: String,
            required: true,
        },
        pick: {
            type: String,
            required: false
        },
        propType: {
            type: String,
            required: false
        },
        timeProp: {
            type: String,
            required: false
        },
        pickFighter: {
            type: String,
            required: false
        },
        fighterProp: {
            type: String,
            required: false
        },
        odds: {
            type: Number,
            required: true
        },
        betAmount: {
            type: Number,
            required: true
        },
        notes: {
            type: String,
            required: false
        }
    }]
})

module.exports = mongoose.model("mmaParlay", mmaParlaySchema)
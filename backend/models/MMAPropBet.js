const mongoose = require('mongoose')

const mmaPropBetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    betType: {
        type: String,
        required: true,
    },
    event: {
        type: String,
        required: true
    },
    matchup: {
        type: String,
        required: true
    },
    propType: {
        type: String,
        required: true
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
})

module.exports = mongoose.model("mmaPropBet", mmaPropBetSchema)
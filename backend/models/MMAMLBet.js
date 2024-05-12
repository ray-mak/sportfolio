const mongoose = require('mongoose')

//This schema is for MMA Moneyline bets
const mmaMLSchema = new mongoose.Schema({
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
    pick: {
        type: String,
        required: true
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

module.exports = mongoose.model("mmaMLBet", mmaMLSchema)

//Bet type
//Event
//Fight
//Winner
//Odds
//Notes
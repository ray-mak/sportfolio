const mongoose = require('mongoose')

const mmaMLBetResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mmaMLBet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MMAMLBet',
        required: true
    },
    profit: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("mmaMLBetResult", mmaMLBetResultSchema)
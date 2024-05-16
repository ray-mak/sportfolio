const mongoose = require('mongoose')

const eventResultSchema = new mongoose.Schema({
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
        matchResults: {
            winner: {
                type: String,
                required: true
            },
            methodOfVictory: {
                type: String,
                required: true
            },
            timeElapsed: {
                type: String,
                required: true,
                validate: {
                    validator: function (v) {
                        return /^\d{1,2}:\d{2}$/.test(v)
                    },
                    message: props => `${props.value} is not a valid time format. Please use "MM:SS" or "M:SS"`
                }
            },
            score: {
                type: String,
                required: false,
                validate: {
                    validator: function (v) {
                        return v === "" || /^\d{2,3}-\d{2,3}$/.test(v);
                    },
                    message: props => `${props.value} is not a valid score format. Please use "##-##".`
                }
            }
        }
    }]
})

module.exports = mongoose.model('EventResult', eventResultSchema)
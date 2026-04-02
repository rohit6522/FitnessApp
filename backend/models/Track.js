const mongoose = require("mongoose")

const trackSchema = new mongoose.Schema({
    userId: String,
    date: String,
    workoutName: String,
    duration: Number,
    calories: Number
}, { timestamps: true })

module.exports = mongoose.model("Track", trackSchema)

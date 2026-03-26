const mongoose = require("mongoose")

const workoutSchema = new mongoose.Schema({
    userId: String,
    day: String,
    name: String,
    type: String,
    exercises: [
        {
            name: String,
            sets: Number,
            reps: Number,
            time: Number
        }
    ]
})

module.exports = mongoose.model("Workout", workoutSchema)
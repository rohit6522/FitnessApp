const mongoose = require("mongoose")

const reminderSchema = new mongoose.Schema({
    userId: String,
    email: String,
    time: String, // "18:30"
})

module.exports = mongoose.model("Reminder", reminderSchema)


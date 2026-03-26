const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: String,
    age: Number,
    weight: Number,
    height: Number,
    goal: String,
    level: String
})

module.exports = mongoose.model("Profile", profileSchema)
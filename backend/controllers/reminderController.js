
const Reminder = require("../models/Reminder")

exports.setReminder = async (req, res) => {
    try {
        const { email, time } = req.body

        // Upsert: Create if doesn't exist, otherwise update the existing time
        const reminder = await Reminder.findOneAndUpdate(
            { email },
            { time },
            { new: true, upsert: true }
        )

        res.json({ message: "Reminder set successfully", reminder })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
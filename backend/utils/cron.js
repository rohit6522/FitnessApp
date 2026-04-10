
const cron = require("node-cron")
const Reminder = require("../models/Reminder")
const sendMail = require("./mailer")

console.log("⏳ Cron job scheduler initialized. Waiting for reminders...");

cron.schedule("* * * * *", async () => {
    const now = new Date()
    const currentTime = now.toTimeString().slice(0,5)
    
    console.log(`[Cron] Minute ticked! Checking database for time: ${currentTime}...`)

    const reminders = await Reminder.find({ time: currentTime })

    if (reminders.length > 0) {
        console.log(`[Cron] Found ${reminders.length} reminder(s)! Sending emails...`)
        reminders.forEach(r => {
            sendMail(r.email)
        })
    }
})
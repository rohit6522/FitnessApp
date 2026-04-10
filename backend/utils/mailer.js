
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
})

const sendMail = async (to) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject: "Workout Reminder 💪",
            text: "Time to workout! Stay consistent 🔥"
        })
        console.log(`✅ Email successfully sent to ${to}`)
    } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error.message)
    }
}

module.exports = sendMail
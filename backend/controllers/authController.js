const User = require("../models/user.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const otpGenerator = require("otp-generator")



exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.json({ msg: "Signup successful" })
    } catch (error) {
        res.status(500).json({ msg: "Server error" })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ msg: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ token, user: { name: user.name, email: user.email } })
    } catch (error) {
        res.status(500).json({ msg: "Server error" })
    }
}


// forgot 


// const nodemailer = require("nodemailer")

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ msg: "User not found" })

        // OTP generate
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        user.otp = otp
        user.otpExpiry = Date.now() + 5 * 60 * 1000
        await user.save()

        // console.log("OTP:", otp)

        // Email send
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "rohitrajyadav6522@gmail.com",       // 👈 apna gmail
                pass: "ytfh hath ifbp hewm"           // 👈 app password
            }
        })

        await transporter.sendMail({
            from: "YOUR_EMAIL@gmail.com",
            to: email,
            subject: "OTP for Password Reset",
            text: `Your OTP is ${otp}`
        })

        res.json({ msg: "OTP sent to email" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error sending OTP" })
    }
}

// reset 
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    const user = await User.findOne({ email })

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
        return res.status(400).json({ msg: "Invalid or expired OTP" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword
    user.otp = null
    user.otpExpiry = null

    await user.save()

    res.json({ msg: "Password updated" })
}
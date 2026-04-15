const User = require("../models/user.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const otpGenerator = require("otp-generator")


exports.googleAuth = async (req, res) => {
    try {
        const { name, email, googleId, profilePicture } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user if they don't exist
            // Note: Since it's a Google login, we don't have a password. 
            // You can generate a random password or make the password field optional in your Mongoose Schema
            user = new User({
                name,
                email,
                password: googleId + process.env.JWT_SECRET, // Dummy password for Google users
                profilePicture
            });
            await user.save();
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during Google Auth" });
    }
};



exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.json({ message: "Signup successful" })
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
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
            text: `Please verify you're really you by entering this 6-digit code when you sign in ${otp}`
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
        return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword
    user.otp = null
    user.otpExpiry = null

    await user.save()

    res.json({ message: "Password updated" })
}
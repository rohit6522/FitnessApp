const Profile = require("../models/Profile")

exports.saveProfile = async (req, res) => {
    try {
        const { name, age, weight, height, goal, level, profilePic } = req.body

        const userId = req.user.id || req.user._id

        let profile = await Profile.findOne({ user: userId })

        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: userId },
                { name, age, weight, height, goal, level, profilePic },
                { new: true }
            )
        } else {
            profile = await Profile.create({
                user: userId,
                name, age, weight, height, goal, level, profilePic
            })
        }

        res.json(profile)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.getProfile = async (req, res) => {
    const profile = await Profile.findOne({ user: req.user.id })
    res.json(profile)
}
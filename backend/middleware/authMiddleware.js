const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {

    const header = req.headers.authorization

    console.log("HEADER:", header) // 👈 DEBUG

    if (!header) {
        return res.status(401).json({ msg: "No token" })
    }

    const token = header.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        console.log(err)
        res.status(401).json({ msg: "Invalid token" })
    }
}
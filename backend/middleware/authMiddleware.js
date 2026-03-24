const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ msg: "No token" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ msg: "Invalid token" })
    }
}
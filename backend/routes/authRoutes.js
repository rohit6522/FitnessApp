const router = require("express").Router()

const { signup, login, forgotPassword, resetPassword } = require("../controllers/authController")

router.post("/signup", signup)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

module.exports = router
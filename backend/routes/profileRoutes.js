const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")

const { saveProfile, getProfile } = require("../controllers/profileController")

router.post("/", auth, saveProfile)
router.get("/", auth, getProfile)

module.exports = router
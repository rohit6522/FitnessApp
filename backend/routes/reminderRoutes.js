
const router = require("express").Router()
const { setReminder } = require("../controllers/reminderController")

router.post("/set", setReminder)

module.exports = router

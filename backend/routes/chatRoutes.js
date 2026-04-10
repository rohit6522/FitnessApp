const router = require("express").Router()
const { chat } = require("../controllers/chatController")

router.post("/", chat)

module.exports = router
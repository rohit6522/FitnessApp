const router = require("express").Router()
const chatController = require("../controllers/chatController")

router.post("/", chatController.chat)
router.post('/chat/workout', chatController.generateWorkout)
router.post('/chat/mealplan', chatController.generateMealPlan)

module.exports = router
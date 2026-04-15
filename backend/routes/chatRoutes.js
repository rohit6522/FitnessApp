const router = require("express").Router()
const { chat } = require("../controllers/chatController")

router.post("/", chat)
router.post('/chat/workout', chatController.generateWorkout);
router.post('/chat/mealplan', chatController.generateMealPlan);


module.exports = router
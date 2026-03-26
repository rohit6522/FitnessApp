const router = require("express").Router()
const Workout = require("../models/Workout")
const auth = require("../middleware/authMiddleware")

// GET BY DAY
router.get("/:day", auth, async (req, res) => {
    const data = await Workout.find({
        userId: req.user.id,
        day: req.params.day
    })
    res.json(data)
})

// CREATE PLAN
router.post("/", auth, async (req, res) => {
    try {
        const { name, type, day, exercises } = req.body

        const workout = new Workout({
            userId: req.user.id,
            name,
            type,
            day,
            exercises
        })

        await workout.save()

        res.json(workout)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: "Server Error" })
    }
})

// DELETE
router.delete("/:id", auth, async (req, res) => {
    await Workout.findByIdAndDelete(req.params.id)
    res.json({ msg: "Deleted" })
})

module.exports = router
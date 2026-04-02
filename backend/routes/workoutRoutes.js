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

// UPDATE WORKOUT
router.put("/:id", auth, async (req, res) => {
    try {
        const { name, type, exercises } = req.body

        const workout = await Workout.findById(req.params.id)

        if (!workout) {
            return res.status(404).json({ msg: "Workout not found" })
        }

        // SECURITY (user check)
        if (workout.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Unauthorized" })
        }

        workout.name = name || workout.name
        workout.type = type || workout.type
        workout.exercises = exercises || workout.exercises

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
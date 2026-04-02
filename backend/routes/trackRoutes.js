const router = require("express").Router()
const Track = require("../models/Track")

// ADD LOG
router.post("/", async (req, res) => {
    try {
        const data = await Track.create(req.body)
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET USER DATA
router.get("/:userId", async (req, res) => {
    try {
        const data = await Track.find({ userId: req.params.userId })
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get("/stats/:userId", async (req, res) => {
    try {
        const logs = await Track.find({ userId: req.params.userId })

        const now = new Date()
        const weekStart = new Date()
        weekStart.setDate(now.getDate() - 7)

        // 📅 THIS WEEK
        const thisWeek = logs.filter(l => new Date(l.date) >= weekStart).length

        // ⚡ CALORIES
        const calories = logs.reduce((sum, l) => sum + (l.calories || 0), 0)

        // 🔥 STREAK
        let streak = 0
        let current = new Date()

        while (true) {
            const found = logs.find(l =>
                new Date(l.date).toDateString() === current.toDateString()
            )

            if (found) {
                streak++
                current.setDate(current.getDate() - 1)
            } else break
        }

        res.json({ thisWeek, calories, streak })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
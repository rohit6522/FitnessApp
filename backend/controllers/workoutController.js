exports.deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findByIdAndDelete(req.params.id)
        res.json(workout)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
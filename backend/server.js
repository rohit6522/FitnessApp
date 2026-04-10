const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env") })

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db.js")

const app = express()

// change

app.use(cors({
    origin:[
        "http://localhost:5173",
        "https://fitnessapp-frontend-xiht.onrender.com"
    ],
    credentials: true
}))

require("./utils/cron")

app.use(express.json())

connectDB()

app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/workouts", require("./routes/workoutRoutes"))
app.use("/api/profile", require("./routes/profileRoutes"))
app.use("/api/track", require("./routes/trackRoutes"))
app.use("/api/reminder", require("./routes/reminderRoutes"))

app.use("/api/chat", require("./routes/chatRoutes"))

app.listen(5000, () => {
    console.log("Server running on port 5000")
})

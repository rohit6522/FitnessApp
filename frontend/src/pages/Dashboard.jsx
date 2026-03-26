import Navbar from "../components/Navbar"
import { useState, useEffect } from "react"
import { API } from "../api"
import { FaFire } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export default function Dashboard() {

    const user = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate()

    const [workouts, setWorkouts] = useState([])
    const [input, setInput] = useState("")

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const res = await API.get("/workouts")
                console.log(res.data)
                setWorkouts(res.data)
            } catch (err) {
                console.log("Error:", err)
            }
        }

        if (user) fetchWorkouts()
    }, [])

    const addWorkout = async () => {
        try {
            const res = await API.post("/workouts", { name: input })
            setWorkouts([...workouts, res.data])
            setInput("")
        } catch (err) {
            console.log(err)
        }
    }

    const deleteWorkout = async (id) => {
        try {
            await API.delete(`/workouts/${id}`)
            setWorkouts(workouts.filter(w => w._id !== id))
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 relative overflow-hidden p-6">
            {/* Glowing Orbs for Aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Navbar />

                {/* TOP BANNER */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl mb-8 relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-[80px] group-hover:bg-lime-500/20 transition-all duration-500 pointer-events-none"></div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-lime-500 mb-2 tracking-wider uppercase">Good evening</p>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                            {user?.name} 💪
                        </h1>
                        <p className="text-gray-400 font-medium text-lg">
                            No workout scheduled for today. Rest day!
                        </p>
                    </div>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-lg text-center flex flex-col justify-center items-center transition-all hover:bg-white/10 hover:-translate-y-1">
                        <p className="text-5xl font-black text-white mb-3">0</p>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-sm">📅 This Week</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-lg text-center flex flex-col justify-center items-center transition-all hover:bg-white/10 hover:-translate-y-1">
                        <p className="text-5xl font-black text-white mb-3">0</p>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-sm">🔥 Day Streak</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-lg text-center flex flex-col justify-center items-center transition-all hover:bg-white/10 hover:-translate-y-1">
                        <p className="text-5xl font-black text-white mb-3">0</p>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-sm">⚡ Calories</p>
                    </div>
                </div>
                 
                {/* ACTION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                        onClick={() => navigate("/plan")}
                        className="group bg-gradient-to-br from-lime-500/10 to-emerald-500/10 backdrop-blur-xl border border-lime-500/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(132,204,22,0.1)] text-center cursor-pointer hover:shadow-[0_0_40px_rgba(132,204,22,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                    >
                        <p className="text-2xl font-bold text-white group-hover:text-lime-400 transition-colors">📋 View My Plan</p>
                    </div>

                    <div className="group bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-lg text-center cursor-pointer hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
                        <p className="text-2xl font-bold text-white group-hover:text-white transition-colors">🏋️‍♂️ Browse Exercises</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
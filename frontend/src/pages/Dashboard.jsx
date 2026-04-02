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
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme === "dark" : true;
    })

    const [stats, setStats] = useState({
        thisWeek: 0,
        calories: 0,
        streak: 0
    })


    useEffect(() => {
        // toast.success("Working")   
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

    useEffect(() => {
    const fetchStats = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        if (!user) return

        const res = await API.get(`/track/stats/${user._id || user.id}`)
        setStats(res.data)
    }

    fetchStats()
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

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    }

    return (
        <div className={`min-h-screen relative overflow-hidden p-6 transition-colors duration-500 ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
            {/* Glowing Orbs for Aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Navbar isDarkMode={isDarkMode} />

                {/* THEME TOGGLE */}
                <div className="flex justify-end mb-4 mt-2">
                    <button
                        onClick={toggleTheme}
                        className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-300 border shadow-sm flex items-center gap-2 ${
                            isDarkMode
                                ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
                                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </button>
                </div>

                {/* TOP BANNER */}
                <div className={`backdrop-blur-xl border p-8 rounded-3xl mb-8 relative overflow-hidden shadow-2xl group transition-colors duration-500 ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-[80px] group-hover:bg-lime-500/20 transition-all duration-500 pointer-events-none"></div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-lime-500 mb-2 tracking-wider uppercase">Good evening</p>
                        <h1 className={`text-4xl md:text-5xl font-black mb-3 tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {user?.name} 💪
                        </h1>
                        <p className={`font-medium text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            No workout scheduled for today. Rest day!
                        </p>
                    </div>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className={`backdrop-blur-xl border p-6 rounded-3xl shadow-lg text-center flex flex-col justify-center items-center transition-all hover:-translate-y-1 duration-500 ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                        <p className={`text-5xl font-black mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{stats.thisWeek}</p>
                        <p className={`font-semibold uppercase tracking-wider text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>📅 This Week</p>
                    </div>

                    <div className={`backdrop-blur-xl border p-6 rounded-3xl shadow-lg text-center flex flex-col justify-center items-center transition-all hover:-translate-y-1 duration-500 ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                        <p className={`text-5xl font-black mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{stats.streak}</p>
                        <p className={`font-semibold uppercase tracking-wider text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>🔥 Day Streak</p>
                    </div>

                    <div className={`backdrop-blur-xl border p-6 rounded-3xl shadow-lg text-center flex flex-col justify-center items-center transition-all hover:-translate-y-1 duration-500 ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                        <p className={`text-5xl font-black mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{stats.calories}</p>
                        <p className={`font-semibold uppercase tracking-wider text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>⚡ Calories</p>
                    </div>
                </div>

                {/* ACTION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`group backdrop-blur-xl border p-8 rounded-3xl shadow-lg text-center hover:-translate-y-1 transition-all duration-500 flex items-center justify-center ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                        <button
                            onClick={() => navigate("/plan")}
                            className="w-full md:w-auto bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-extrabold text-lg px-8 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] active:scale-95 flex items-center justify-center gap-2 mx-auto"
                        >
                            <span>📋</span> View My Plan
                        </button>
                    </div>

                    <div className={`group backdrop-blur-xl border p-8 rounded-3xl shadow-lg text-center hover:-translate-y-1 transition-all duration-500 flex items-center justify-center ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                        <button
                            onClick={() => navigate("/explore")}

                            className="w-full md:w-auto bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-extrabold text-lg px-8 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] active:scale-95 flex items-center justify-center gap-2 mx-auto"
                        >
                            <span>🔍</span> Browse Exercises
                        </button>

                    </div>


                </div>
            </div>
        </div>
    )
}
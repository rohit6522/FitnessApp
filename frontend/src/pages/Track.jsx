import Navbar from "../components/Navbar"
import { useState, useEffect } from "react"
import { API } from "../api"
import { toast } from "sonner"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function Track() {

    const user = JSON.parse(localStorage.getItem("user"))

    const [logs, setLogs] = useState([])
    const [show, setShow] = useState(false)

    const [form, setForm] = useState({
        workoutName: "",
        duration: "",
        calories: ""
    })
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme === "dark" : true;
    })

    // FETCH DATA
    useEffect(() => {
        if (!user) return
        fetchLogs()
    }, [])

    const fetchLogs = async () => {
        try {
            const res = await API.get(`/track/${user._id || user.id}`)
            setLogs(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    // ADD LOG
    const addLog = async () => {
        try {
            await API.post("/track", {
                ...form,
                userId: user._id || user.id,
                date: new Date()
            })

            toast.success("Workout Logged ✅")
            setShow(false)
            fetchLogs()
            window.location.reload()  
        } catch (err) {
            toast.error("Error ❌")
        }
    }

    // 📊 GRAPH DATA
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

    const chartData = days.map(day => {
        const count = logs.filter(l =>
            new Date(l.date).toLocaleString("en-US", { weekday: "short" }) === day
        ).length

        return { day, workouts: count }
    })

    // 💡 TOOLTIP
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`border p-3 rounded-xl shadow-xl backdrop-blur-md ${isDarkMode ? "bg-[#111] border-white/10" : "bg-white border-gray-200"}`}>
                    <p className={`font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{label}</p>
                    <p className="text-lime-500 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-lime-500 inline-block"></span>
                        {payload[0].value} {payload[0].value === 1 ? 'workout' : 'workouts'}
                    </p>
                </div>
            )
        }
        return null
    }

    // Filter logs to only show today's workouts in the list
    const todayLogs = logs.filter(l => new Date(l.date).toDateString() === new Date().toDateString())

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    }

    return (
        <div className={`min-h-screen relative overflow-hidden p-4 md:p-6 transition-colors duration-500 ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
            {/* Glowing Orbs for Aesthetic */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 mt-6">
                    <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        Workout <span className="text-lime-500">Tracker</span>
                    </h1>

                    <button
                        onClick={() => setShow(true)}
                        className={`font-bold px-6 py-3 rounded-xl border transition-all duration-300 hover:bg-lime-500 hover:text-black hover:border-lime-500 shadow-lg ${isDarkMode ? "bg-white/10 text-white border-white/20" : "bg-white text-gray-800 border-gray-200"}`}
                    >
                        + Log Workout
                    </button>
                </div>

                {/* GRAPH */}
                <div className={`backdrop-blur-xl border p-6 rounded-3xl shadow-lg mb-8 relative overflow-hidden group transition-colors duration-500 ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-[50px] group-hover:bg-lime-500/20 transition-all duration-500 pointer-events-none"></div>
                    <h2 className={`text-2xl font-bold mb-6 relative z-10 ${isDarkMode ? "text-white" : "text-gray-900"}`}>This Week's <span className="text-lime-500">Activity</span></h2>

                    <div className="relative z-10">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="day" stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                                <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}} />
                                <Bar dataKey="workouts" fill="#84cc16" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* TODAY'S WORKOUTS */}
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Today's <span className="text-emerald-500">Workouts</span></h2>

                <div className="space-y-4">
                    {todayLogs.length === 0 ? (
                        <div className={`backdrop-blur-xl border border-dashed p-8 md:p-12 text-center rounded-3xl shadow-lg transition-all ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-300"}`}>
                            <p className={`font-medium text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                No workouts logged today. Start tracking your progress!
                            </p>
                        </div>
                    ) : (
                        todayLogs.map(l => (
                            <div key={l._id} className={`backdrop-blur-xl border p-5 rounded-2xl shadow-lg flex justify-between items-center transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                                <div>
                                    <p className={`text-xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{l.workoutName}</p>
                                    <p className={`text-sm font-medium inline-block px-2 py-0.5 rounded-md ${isDarkMode ? "text-lime-500 bg-lime-500/10" : "text-lime-700 bg-lime-100"}`}>
                                        {new Date(l.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-semibold flex items-center justify-end gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}><span className="text-gray-400 text-sm">⏱</span> {l.duration} min</p>
                                    <p className={`font-semibold flex items-center justify-end gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}><span className="text-gray-400 text-sm">🔥</span> {l.calories} kcal</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>

            {/* MODAL */}
            {show && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`border w-full max-w-md p-8 rounded-3xl shadow-2xl animate-fadeIn relative overflow-hidden ${isDarkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-200"}`}>
                        <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-lime-500/20 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>Log Workout</h2>
                            <button onClick={() => setShow(false)} className={`transition-colors p-2 rounded-xl ${isDarkMode ? "text-gray-500 hover:text-white bg-white/5" : "text-gray-500 hover:text-gray-900 bg-gray-100"}`}>✖</button>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="space-y-1.5">
                                <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Workout Name</label>
                                <input
                                    placeholder="e.g., Upper Body Power"
                                    className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-lime-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`}
                                    onChange={e => setForm({ ...form, workoutName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Duration (min)</label>
                                <input
                                    type="number"
                                    placeholder="45"
                                    className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-lime-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`}
                                    onChange={e => setForm({ ...form, duration: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Calories Burned</label>
                                <input
                                    type="number"
                                    placeholder="300"
                                    className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-lime-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`}
                                    onChange={e => setForm({ ...form, calories: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={addLog}
                                className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-extrabold text-lg py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] active:scale-95 mt-6"
                            >
                                SAVE LOG
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
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
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts"

export default function Track() {

    const user = JSON.parse(localStorage.getItem("user"))

    const [logs, setLogs] = useState([])
    const [show, setShow] = useState(false)
    const [activeTab, setActiveTab] = useState("workouts") // "workouts" | "measurements"

    const [measurements, setMeasurements] = useState([])
    const [showMeasurementModal, setShowMeasurementModal] = useState(false)
    const [measurementForm, setMeasurementForm] = useState({
        weight: "", bodyFat: "", waist: "", chest: "", biceps: "", thighs: ""
    })

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
        fetchMeasurements()
    }, [])

    const fetchLogs = async () => {
        try {
            const res = await API.get(`/track/${user._id || user.id}`)
            setLogs(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
            console.log(err)
        }
    }

    const fetchMeasurements = async () => {
        try {
            const res = await API.get(`/measurements/${user._id || user.id}`)
            setMeasurements(Array.isArray(res.data) ? res.data : [])
        } catch (err) {
            // Fallback to local storage so it works immediately even before you build the backend route!
            const localM = localStorage.getItem("local_measurements")
            if (localM) setMeasurements(JSON.parse(localM))
        }
    }

    // ADD LOG
    const addLog = async () => {
        if (!form.workoutName || !form.duration || !form.calories) {
            toast.error("Please fill all fields ⚠️")
            return
        }
        
        try {
            await API.post("/track", {
                ...form,
                userId: user._id || user.id,
                date: new Date()
            })

            toast.success("Workout Logged ✅")
            setShow(false)
            setForm({ workoutName: "", duration: "", calories: "" })
            fetchLogs()
        } catch (err) {
            toast.error("Error ❌")
        }
    }

    // ADD MEASUREMENT
    const addMeasurementLog = async () => {
        try {
            const newLog = {
                ...measurementForm,
                userId: user._id || user.id,
                date: new Date(),
                _id: Date.now().toString() // Fallback ID
            }
            
            try {
                await API.post("/measurements", newLog)
            } catch (e) {
                // Fallback to local storage if backend route isn't created yet
                const updated = [...measurements, newLog]
                setMeasurements(updated)
                localStorage.setItem("local_measurements", JSON.stringify(updated))
            }

            toast.success("Measurements Logged 📏")
            setShowMeasurementModal(false)
            setMeasurementForm({ weight: "", bodyFat: "", waist: "", chest: "", biceps: "", thighs: "" })
            fetchMeasurements()
        } catch (err) {
            toast.error("Error ❌")
        }
    }

    // 📊 GRAPH DATA
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const chartData = days.map((day, index) => {
        const count = logs.filter(l => {
            const logDate = new Date(l.date);
            return logDate >= startOfWeek && logDate.getDay() === index;
        }).length

        return { day, workouts: count }
    })

    // 💡 TOOLTIP
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`border p-3 rounded-xl shadow-xl backdrop-blur-md ${isDarkMode ? "bg-[#111] border-white/10" : "bg-white border-gray-200"}`}>
                    <p className={`font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{label}</p>
                    <p className="text-orange-500 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                        {payload[0].value} {payload[0].value === 1 ? 'workout' : 'workouts'}
                    </p>
                </div>
            )
        }
        return null
    }

    // 💡 MEASUREMENT TOOLTIP
    const MeasurementTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`border p-3 rounded-xl shadow-xl backdrop-blur-md ${isDarkMode ? "bg-[#111] border-white/10" : "bg-white border-gray-200"}`}>
                    <p className={`font-bold mb-2 border-b pb-2 ${isDarkMode ? "text-white border-white/10" : "text-gray-900 border-gray-200"}`}>{new Date(label).toLocaleDateString()}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="font-bold text-sm flex items-center justify-between gap-4 mb-1">
                            <span>{entry.name}:</span>
                            <span>{entry.value}</span>
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    }

    const sortedMeasurements = [...measurements].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className={`min-h-screen relative overflow-hidden p-4 md:p-6 transition-colors duration-500 animate-fadeIn ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
            {/* Glowing Orbs for Aesthetic */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 mt-6">
                    <h1 className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        Workout <span className="text-orange-500">Tracker</span>
                    </h1>

                    <div className={`flex p-1.5 rounded-2xl border backdrop-blur-md ${isDarkMode ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-200"}`}>
                        <button 
                            onClick={() => setActiveTab("workouts")} 
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === "workouts" ? "bg-orange-500 text-black shadow-md" : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                        >
                            Workouts
                        </button>
                        <button 
                            onClick={() => setActiveTab("measurements")} 
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${activeTab === "measurements" ? "bg-orange-500 text-black shadow-md" : isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
                        >
                            Measurements
                        </button>
                    </div>
                </div>

                {/* ================= WORKOUTS TAB ================= */}
                {activeTab === "workouts" ? (
                    <div className="animate-fadeIn">
                        <div className="flex justify-end mb-4">
                            <button onClick={() => setShow(true)} className={`font-bold px-6 py-3 rounded-xl border transition-all duration-300 hover:bg-orange-500 hover:text-black hover:border-orange-500 shadow-lg ${isDarkMode ? "bg-white/10 text-white border-white/20" : "bg-white text-gray-800 border-gray-200"}`}>
                                + Log Workout
                            </button>
                        </div>

                        {/* GRAPH */}
                        <div className={`backdrop-blur-xl border p-6 rounded-3xl shadow-lg mb-8 relative overflow-hidden group transition-colors duration-500 ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[50px] group-hover:bg-orange-500/20 transition-all duration-500 pointer-events-none"></div>
                            <h2 className={`text-2xl font-bold mb-6 relative z-10 ${isDarkMode ? "text-white" : "text-gray-900"}`}>This Week's <span className="text-orange-500">Activity</span></h2>

                            <div className="relative z-10">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="day" stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} allowDecimals={false} />
                                        <Tooltip content={<CustomTooltip />} cursor={{fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}} />
                                        <Bar dataKey="workouts" fill="#f97316" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* RECENT */}
                        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Recent <span className="text-rose-500">Workouts</span></h2>

                        <div className="space-y-4 mb-10">
                            {logs.length === 0 ? (
                                <div className={`backdrop-blur-xl border border-dashed p-8 md:p-12 text-center rounded-3xl shadow-lg transition-all ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-300"}`}>
                                    <p className={`font-medium text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                        No workouts logged yet. Start tracking your progress!
                                    </p>
                                </div>
                            ) : (
                                logs.map(l => (
                                    <div key={l._id} className={`backdrop-blur-xl border p-5 rounded-2xl shadow-lg flex justify-between items-center transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                                        <div>
                                            <p className={`text-xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{l.workoutName}</p>
                                            <p className={`text-sm font-medium inline-block px-2 py-0.5 rounded-md ${isDarkMode ? "text-orange-500 bg-orange-500/10" : "text-orange-700 bg-orange-100"}`}>
                                                {new Date(l.date).toLocaleDateString()}
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
                ) : (
                /* ================= MEASUREMENTS TAB ================= */
                    <div className="animate-fadeIn">
                        <div className="flex justify-end mb-4">
                            <button onClick={() => setShowMeasurementModal(true)} className={`font-bold px-6 py-3 rounded-xl border transition-all duration-300 hover:bg-orange-500 hover:text-black hover:border-orange-500 shadow-lg ${isDarkMode ? "bg-white/10 text-white border-white/20" : "bg-white text-gray-800 border-gray-200"}`}>
                                + Log Measurement
                            </button>
                        </div>

                        {/* MEASUREMENTS LINE GRAPH */}
                        <div className={`backdrop-blur-xl border p-6 rounded-3xl shadow-lg mb-8 relative overflow-hidden group transition-colors duration-500 ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[50px] group-hover:bg-orange-500/20 transition-all duration-500 pointer-events-none"></div>
                            <h2 className={`text-2xl font-bold mb-6 relative z-10 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Body <span className="text-orange-500">Composition</span></h2>

                            <div className="relative z-10">
                                {sortedMeasurements.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={350}>
                                        <LineChart data={sortedMeasurements} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#e5e7eb"} vertical={false} />
                                            <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                                            <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                                            <Tooltip content={<MeasurementTooltip />} cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '5 5' }} />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                            <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#f97316" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                            <Line type="monotone" dataKey="waist" name="Waist (cm)" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                            <Line type="monotone" dataKey="bodyFat" name="Body Fat %" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                            <Line type="monotone" dataKey="chest" name="Chest (cm)" stroke="#ec4899" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                            <Line type="monotone" dataKey="biceps" name="Biceps (cm)" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                            <Line type="monotone" dataKey="thighs" name="Thighs (cm)" stroke="#eab308" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-center">
                                        <p className={`font-medium ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Not enough data to display graph. Log your first measurement!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* MEASUREMENT HISTORY LIST */}
                        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>History <span className="text-rose-500">Logs</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            {sortedMeasurements.slice().reverse().map((m, i) => (
                                <div key={m._id || i} className={`backdrop-blur-xl border p-5 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                                    <div className="flex justify-between items-center border-b pb-3 mb-3 border-opacity-50 border-gray-500">
                                        <p className={`font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{new Date(m.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-y-3 gap-x-2 text-sm">
                                        <div><span className="block text-xs text-gray-500 uppercase font-bold">Weight</span><span className={`font-bold ${isDarkMode ? "text-orange-400" : "text-orange-600"}`}>{m.weight || '-'} kg</span></div>
                                        <div><span className="block text-xs text-gray-500 uppercase font-bold">Body Fat</span><span className={`font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>{m.bodyFat || '-'} %</span></div>
                                        <div><span className="block text-xs text-gray-500 uppercase font-bold">Waist</span><span className={`font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>{m.waist || '-'} cm</span></div>
                                        <div><span className="block text-xs text-gray-500 uppercase font-bold">Chest</span><span className={`font-bold ${isDarkMode ? "text-pink-400" : "text-pink-600"}`}>{m.chest || '-'} cm</span></div>
                                        <div><span className="block text-xs text-gray-500 uppercase font-bold">Biceps</span><span className={`font-bold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>{m.biceps || '-'} cm</span></div>
                                        <div><span className="block text-xs text-gray-500 uppercase font-bold">Thighs</span><span className={`font-bold ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>{m.thighs || '-'} cm</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* MODAL */}
            {show && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`border w-full max-w-md p-8 rounded-3xl shadow-2xl animate-fadeIn relative overflow-hidden ${isDarkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-200"}`}>
                        <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-orange-500/20 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>Log Workout</h2>
                            <button onClick={() => setShow(false)} className={`transition-colors p-2 rounded-xl ${isDarkMode ? "text-gray-500 hover:text-white bg-white/5" : "text-gray-500 hover:text-gray-900 bg-gray-100"}`}>✖</button>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="space-y-1.5">
                                <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Workout Name</label>
                                <input
                                    value={form.workoutName}
                                    placeholder="e.g., Upper Body Power"
                                    className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-orange-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`}
                                    onChange={e => setForm({ ...form, workoutName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Duration (min)</label>
                                <input
                                    type="number"
                                    value={form.duration}
                                    placeholder="45"
                                    className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-orange-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`}
                                    onChange={e => setForm({ ...form, duration: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Calories Burned</label>
                                <input
                                    type="number"
                                    value={form.calories}
                                    placeholder="300"
                                    className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-orange-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`}
                                    onChange={e => setForm({ ...form, calories: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={addLog}
                                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-black font-extrabold text-lg py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95 mt-6"
                            >
                                SAVE LOG
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MEASUREMENTS MODAL */}
            {showMeasurementModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`border w-full max-w-md p-8 rounded-3xl shadow-2xl animate-fadeIn relative overflow-y-auto max-h-[90vh] ${isDarkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-200"}`}>
                        <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-orange-500/20 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>Log Measurements</h2>
                            <button onClick={() => setShowMeasurementModal(false)} className={`transition-colors p-2 rounded-xl ${isDarkMode ? "text-gray-500 hover:text-white bg-white/5" : "text-gray-500 hover:text-gray-900 bg-gray-100"}`}>✖</button>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Weight (kg)</label>
                                    <input type="number" value={measurementForm.weight} onChange={e => setMeasurementForm({...measurementForm, weight: e.target.value})} placeholder="e.g. 75" className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-orange-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Body Fat (%)</label>
                                    <input type="number" value={measurementForm.bodyFat} onChange={e => setMeasurementForm({...measurementForm, bodyFat: e.target.value})} placeholder="e.g. 15" className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-orange-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`} />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Waist (cm)</label>
                                    <input type="number" value={measurementForm.waist} onChange={e => setMeasurementForm({...measurementForm, waist: e.target.value})} placeholder="e.g. 80" className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-orange-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Chest (cm)</label>
                                    <input type="number" value={measurementForm.chest} onChange={e => setMeasurementForm({...measurementForm, chest: e.target.value})} placeholder="e.g. 100" className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-orange-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Biceps (cm)</label>
                                    <input type="number" value={measurementForm.biceps} onChange={e => setMeasurementForm({...measurementForm, biceps: e.target.value})} placeholder="e.g. 35" className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-orange-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Thighs (cm)</label>
                                    <input type="number" value={measurementForm.thighs} onChange={e => setMeasurementForm({...measurementForm, thighs: e.target.value})} placeholder="e.g. 60" className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-orange-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`} />
                                </div>
                            </div>

                            <button
                                onClick={addMeasurementLog}
                                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-black font-extrabold text-lg py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95 mt-6"
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
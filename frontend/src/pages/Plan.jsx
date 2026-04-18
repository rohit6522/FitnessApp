import Navbar from "../components/Navbar"
import { useState, useEffect } from "react"
import { API } from "../api"
import { toast } from "sonner"

import { useNavigate, useLocation } from "react-router-dom"
import { FaPlus, FaEdit, FaTrash, FaDumbbell, FaCheckCircle, FaTimes, FaCalendarAlt, FaMagic, FaSpinner } from "react-icons/fa"


export default function Plan() {
    
    const navigate = useNavigate()
    const location = useLocation()

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    
    const user = JSON.parse(localStorage.getItem("user"))

    const [editModal, setEditModal] = useState(false)
    const [editId, setEditId] = useState(null)
    const [activeDay, setActiveDay] = useState(days[new Date().getDay()])
    const [workouts, setWorkouts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme === "dark" : true;
    })

    const [workoutName, setWorkoutName] = useState("")
    const [type, setType] = useState("Strength")

    const [exerciseName, setExerciseName] = useState("")
    const [exerciseList, setExerciseList] = useState([])
    const [sets, setSets] = useState("")
    const [reps, setReps] = useState("")
    const [time, setTime] = useState("")
    
    const [aiPrompt, setAiPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [showAiInput, setShowAiInput] = useState(false)
    
    const [trackedLogs, setTrackedLogs] = useState([])


    // FETCH
    useEffect(() => {
        const fetch = async () => {
            const res = await API.get(`/workouts/${activeDay}`)
            setWorkouts(res.data)
        }
        fetch()
    }, [activeDay])

    // FETCH LOGS FOR CALENDAR
    useEffect(() => {
        if (!user) return
        const fetchLogs = async () => {
            try {
                const res = await API.get(`/track/${user._id || user.id}`)
                setTrackedLogs(Array.isArray(res.data) ? res.data : [])
            } catch (err) {
                console.log(err)
            }
        }
        fetchLogs()
    }, [])

    // PARSE CALENDAR DATES
    const trackedDates = new Set(trackedLogs.map(log => {
        const d = new Date(log.date);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    }));

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const todayDateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // HANDLE REDIRECT FROM EXPLORE
    useEffect(() => {
        if (location.state?.exercise) {
            setExerciseName(location.state.exercise.name)
            setShowModal(true)
            navigate(location.pathname, { replace: true, state: {} }) // Clear state to prevent reopening on reload
        }
    }, [location, navigate])

    // ADD EXERCISE
    const addExercise = () => {
        if (!exerciseName) return

        setExerciseList([
            ...exerciseList,
            { name: exerciseName, sets, reps, time }
        ])

        setExerciseName("")
        setSets("")
        setReps("")
        setTime("")
    }

    // CREATE PLAN
    const createPlan = async () => {
        try {
            if (!workoutName) {
                toast.error("Enter workout name")
                return
            }

            const res = await API.post("/workouts", {
                name: workoutName,
                type,
                day: activeDay,
                exercises: exerciseList
            })

            setWorkouts([...workouts, res.data])

            setIsSuccess(true)

            setTimeout(() => {
                setWorkoutName("")
                setExerciseList([])
                setIsSuccess(false)
                setShowModal(false)
            }, 2000)

        } catch (err) {
            console.log(err.response?.data || err.message)
            toast.error(err.response?.data?.message || "Error creating plan")
        }
    }

    // GENERATE WITH AI
    const generateWithAI = async () => {
        if (!aiPrompt) return;
        setIsGenerating(true);
        try {
            // Adjust the API route if your backend is configured differently
            const res = await API.post("/chat/workout", { prompt: aiPrompt });
            setWorkoutName(res.data.name || "AI Workout");
            setType(res.data.type || "Strength");
            setExerciseList(res.data.exercises || []);
            
            setShowAiInput(false);
            setAiPrompt("");
            toast.success("AI generated your workout! Review and save. 🪄");
        } catch (err) {
            console.log(err);
            toast.error("AI generation failed. Try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    // DELETE
    const deleteExercise = (index) => {
        const updated = exerciseList.filter((_, i) => i !== index)
        setExerciseList(updated)
    }

    const openEdit = (w) => {
        setShowModal(false)
        setEditId(w._id)
        setWorkoutName(w.name)
        setType(w.type)
        setExerciseList(w.exercises || [])
        setEditModal(true)
    }

    const deleteWorkout = async (id) => {
        try {
            await API.delete(`/workouts/${id}`)

            setWorkouts(workouts.filter(w => w._id !== id))

        } catch (err) {
            console.log(err)
        }
    }

    const updateWorkout = async () => {
        try {
            const res = await API.put(`/workouts/${editId}`, {
                name: workoutName,
                type,
                exercises: exerciseList
            })

            setWorkouts(workouts.map(w =>
                w._id === editId ? res.data : w
            ))

            setEditModal(false)

        } catch (err) {
            console.log(err)
        }
    }

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    }

    return (
        <div className={`min-h-screen relative overflow-hidden p-4 md:p-6 transition-colors duration-500 ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
            {/* Glowing Orbs for Aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                {/* HEADER */}
                <div className="mb-10">
                    <h1 className={`text-4xl md:text-5xl font-black tracking-tighter mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        My <span className="text-orange-500">Plan</span>
                    </h1>
                    <p className={`font-medium text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Organize your weekly routine and stay consistent.</p>
                </div>

                {/* LAYOUT CONTAINER */}
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* LEFT SIDE: PLANNER */}
                    <div className="w-full lg:w-2/3">
                {/* DAYS SELECTOR */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ease-out border active:scale-95 flex-1 sm:flex-none text-center ${
                                activeDay === day
                                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-black border-transparent shadow-[0_10px_20px_-5px_rgba(249,115,22,0.5)] scale-110 -translate-y-1 z-10"
                                    : isDarkMode 
                                        ? "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-orange-500/30 hover:shadow-[0_8px_15px_-5px_rgba(249,115,22,0.2)] hover:scale-105 hover:-translate-y-0.5 z-0" 
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-orange-500/40 hover:shadow-[0_8px_15px_-5px_rgba(249,115,22,0.3)] hover:scale-105 hover:-translate-y-0.5 z-0"
                            }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* WORKOUT LIST OR EMPTY STATE */}
                {workouts.length === 0 ? (
                    <div className={`backdrop-blur-xl border border-dashed p-12 md:p-24 text-center rounded-[2.5rem] shadow-lg transition-all duration-500 ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-500/30" : "bg-white border-gray-300 hover:bg-gray-50 hover:border-orange-500/50"}`}>
                        <FaCalendarAlt className={`text-6xl mx-auto mb-6 opacity-20 ${isDarkMode ? "text-white" : "text-gray-900"}`} />
                        <p className={`font-medium mb-6 text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            No workout planned for <span className="text-orange-500 font-bold">{activeDay}</span>
                        </p>

                        <button
                            onClick={() => setShowModal(true)}
                            className={`font-bold px-8 py-3.5 rounded-xl border transition-all duration-300 hover:scale-105 hover:bg-orange-500 hover:text-black hover:border-orange-500 shadow-sm flex items-center gap-2 mx-auto ${isDarkMode ? "bg-white/10 text-white border-white/20" : "bg-white text-gray-800 border-gray-200"}`}
                        >
                            <FaPlus /> Add Workout
                        </button>
                    </div>
                ) : (
                <>
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setShowModal(true)}
                            className={`font-bold px-6 py-2.5 rounded-xl border transition-all duration-300 hover:scale-105 hover:bg-orange-500 hover:text-black hover:border-orange-500 shadow-sm flex items-center gap-2 ${isDarkMode ? "bg-white/10 text-white border-white/20" : "bg-white text-gray-800 border-gray-200"}`}
                        >
                            <FaPlus /> Add Another Workout
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {workouts.map(w => (
                            <div key={w._id} className={`backdrop-blur-xl border p-6 md:p-8 rounded-[2rem] shadow-lg relative overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.3)] ${isDarkMode ? "bg-white/5 border-white/10 hover:border-orange-500/30" : "bg-white border-gray-200 hover:border-orange-500/50"}`}>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-[60px] group-hover:scale-150 transition-all duration-700 pointer-events-none"></div>

                                <div className="flex justify-between items-start relative z-10 mb-4">
                                    <div>
                                        <h2 className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{w.name}</h2>
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-lg tracking-wider uppercase ${isDarkMode ? "bg-white/10 text-orange-400" : "bg-orange-100 text-orange-700"}`}>{w.type}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEdit(w)}
                                            className={`p-2.5 rounded-xl transition-all duration-300 ${isDarkMode ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:scale-110" : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-110"}`}
                                            title="Edit Workout"
                                        >
                                            <FaEdit />
                                        </button>

                                        <button
                                            onClick={() => deleteWorkout(w._id)}
                                            className={`p-2.5 rounded-xl transition-all duration-300 ${isDarkMode ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-110" : "bg-red-50 text-red-600 hover:bg-red-100 hover:scale-110"}`}
                                            title="Delete Workout"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>

                                </div>

                                {/* EXERCISES */}
                                <div className="space-y-3 relative z-10">
                                    {w.exercises?.map((ex, i) => (
                                        <div key={i} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 rounded-xl border transition-colors ${isDarkMode ? "bg-black/40 border-white/5 hover:border-white/10" : "bg-gray-50 border-gray-200 hover:bg-white hover:shadow-sm"}`}>
                                            <div className={`font-semibold flex items-center gap-3 mb-2 sm:mb-0 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                                                <div className={`p-2 rounded-lg ${isDarkMode ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"}`}><FaDumbbell className="text-sm" /></div>
                                                {ex.name}
                                            </div>
                                            <p className={`text-sm font-bold px-3 py-1.5 rounded-lg text-center ${isDarkMode ? "text-orange-400 bg-orange-500/10" : "text-orange-700 bg-orange-100"}`}>
                                                {ex.sets} sets • {ex.reps} reps • {ex.time}s
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
                )}
                    </div>

                    {/* RIGHT SIDE: WORKOUT CALENDAR */}
                    <div className="w-full lg:w-1/3">
                        <div className={`sticky top-24 backdrop-blur-xl border p-6 rounded-[2rem] shadow-lg transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.3)] ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>Activity <span className="text-orange-500">Log</span></h3>
                                    <p className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{monthNames[currentMonth]} {currentYear}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${isDarkMode ? "bg-orange-500/10" : "bg-orange-50"}`}>
                                    <FaCalendarAlt className="text-2xl text-orange-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                    <div key={d} className={`text-xs font-bold ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{d}</div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                    <div key={`empty-${i}`} />
                                ))}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const dateStr = `${currentYear}-${currentMonth}-${dayNum}`;
                                    const isTracked = trackedDates.has(dateStr);
                                    const isToday = todayDateStr === dateStr;

                                    return (
                                        <div
                                            key={dayNum}
                                            className={`h-10 w-full flex items-center justify-center rounded-xl text-sm font-bold transition-all relative ${
                                                isTracked
                                                    ? "bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.4)] scale-105"
                                                    : isToday
                                                        ? isDarkMode ? "bg-white/20 text-white border-2 border-orange-500/50" : "bg-gray-200 text-gray-900 border-2 border-orange-500/50"
                                                        : isDarkMode ? "bg-white/5 text-gray-400 hover:bg-white/10" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            {isTracked ? <FaCheckCircle className="text-black drop-shadow-sm" size={16} /> : dayNum}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className={`mt-6 pt-4 border-t flex items-center justify-center gap-4 text-xs font-bold ${isDarkMode ? "border-white/10 text-gray-400" : "border-gray-200 text-gray-500"}`}>
                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Done</div>
                                <div className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded-full border-2 border-orange-500/50 ${isDarkMode ? "bg-white/20" : "bg-gray-200"}`}></div> Today</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`border w-full max-w-md p-6 md:p-8 rounded-[2.5rem] shadow-2xl animate-fadeIn relative overflow-y-auto overflow-x-hidden max-h-[90vh] ${isDarkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-200"}`}>
                        <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-orange-500/20 rounded-full blur-[80px] pointer-events-none"></div>

                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center py-12 relative z-10 animate-fadeIn">
                                <FaCheckCircle className="text-7xl text-orange-500 mb-6 animate-bounce drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                                <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>Plan Created!</h2>
                                <p className={`mt-2 font-medium text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Get ready to crush it 💪</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>Create Workout</h2>
                                    <button onClick={() => setShowModal(false)} className={`transition-all p-3 rounded-xl ${isDarkMode ? "text-gray-400 hover:text-white bg-white/5 hover:bg-white/10" : "text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200"}`}>
                                        <FaTimes />
                                    </button>
                                </div>

                                {/* AI GENERATOR SECTION */}
                                <div className={`p-4 rounded-2xl border mb-6 relative overflow-hidden ${isDarkMode ? "bg-orange-500/5 border-orange-500/20" : "bg-orange-50 border-orange-200"}`}>
                                    {!showAiInput ? (
                                        <button onClick={() => setShowAiInput(true)} className="w-full flex items-center justify-center gap-2 font-bold text-orange-500 hover:text-orange-400 transition-colors">
                                            <FaMagic /> Auto-Generate with AI
                                        </button>
                                    ) : (
                                        <div className="space-y-3 animate-fadeIn">
                                            <label className={`text-xs font-bold uppercase tracking-wider text-orange-500`}>What do you want to train?</label>
                                            <textarea
                                                value={aiPrompt}
                                                onChange={(e) => setAiPrompt(e.target.value)}
                                                placeholder="e.g., I have 30 minutes, dumbbells only, and want to hit chest and triceps."
                                                className={`w-full p-3 rounded-xl outline-none border transition-all focus:border-orange-500 resize-none h-20 ${isDarkMode ? "bg-black/40 text-white border-orange-500/30 placeholder-gray-500" : "bg-white text-gray-900 border-orange-200 placeholder-gray-400"}`}
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => setShowAiInput(false)} className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${isDarkMode ? "bg-white/5 text-gray-400 border-white/10" : "bg-gray-100 text-gray-600 border-gray-200"}`}>Cancel</button>
                                                <button 
                                                    onClick={generateWithAI}
                                                    disabled={isGenerating || !aiPrompt}
                                                    className="flex-[2] py-2 rounded-xl font-bold bg-orange-500 text-black flex items-center justify-center gap-2 hover:bg-orange-400 disabled:opacity-50"
                                                >
                                                    {isGenerating ? <FaSpinner className="animate-spin" /> : <><FaMagic /> Generate Plan</>}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="space-y-1.5">
                                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Workout Name</label>
                                        <input
                                            value={workoutName}
                                            onChange={(e) => setWorkoutName(e.target.value)}
                                            placeholder="E.g., Chest Day"
                                            className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-orange-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Workout Type</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-orange-500 appearance-none cursor-pointer ${isDarkMode ? "bg-[#111] text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`}
                                        >
                                            <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>Strength</option>
                                            <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>Cardio</option>
                                            <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>HIIT</option>
                                            <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>Yoga</option>
                                        </select>
                                    </div>

                                    <div className={`pt-4 border-t ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
                                        <label className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2 block">Add Exercises</label>
                                        <input
                                            value={exerciseName}
                                            onChange={(e) => setExerciseName(e.target.value)}
                                            placeholder="Exercise Name"
                                            className={`w-full p-3 rounded-xl outline-none border transition-all focus:border-orange-500 mb-3 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`}
                                        />

                                        <div className="flex gap-2 mb-4">
                                            <input value={sets} onChange={(e) => setSets(e.target.value)} placeholder="Sets" type="number" className={`w-1/3 p-3 rounded-xl outline-none border placeholder-gray-600 focus:border-orange-500 text-center ${isDarkMode ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`} />
                                            <input value={reps} onChange={(e) => setReps(e.target.value)} placeholder="Reps" type="number" className={`w-1/3 p-3 rounded-xl outline-none border placeholder-gray-600 focus:border-orange-500 text-center ${isDarkMode ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`} />
                                            <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time(s)" type="number" className={`w-1/3 p-3 rounded-xl outline-none border placeholder-gray-600 focus:border-orange-500 text-center ${isDarkMode ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`} />
                                        </div>
                                        <button onClick={addExercise} className={`w-full font-semibold py-2.5 rounded-xl border transition-all ${isDarkMode ? "bg-white/10 hover:bg-white/20 text-white border-white/10" : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200"}`}>
                                            <span className="flex items-center justify-center gap-2"><FaPlus /> Add to List</span>
                                        </button>
                                    </div>

                                    {/* SHOW EXERCISES */}
                                    {exerciseList.length > 0 && (
                                        <div className={`rounded-xl p-3 max-h-40 overflow-y-auto border space-y-2 mt-4 ${isDarkMode ? "bg-black/40 border-white/5" : "bg-gray-50 border-gray-200"}`}>
                                            {exerciseList.map((ex, i) => (
                                                <div key={i} className={`flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0 ${isDarkMode ? "border-white/5" : "border-gray-200"}`}>
                                                    <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{ex.name}</span>
                                                    <span className={`px-2.5 py-1 rounded-md font-semibold ${isDarkMode ? "text-orange-400 bg-orange-500/10" : "text-orange-700 bg-orange-100"}`}>{ex.sets}s • {ex.reps}r • {ex.time}s</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={createPlan}
                                        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-black font-extrabold text-lg py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95 mt-6"
                                    >
                                        CREATE PLAN
                                    </button>


                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}


            {/* EDIT MODAL */}
            {editModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                    <div className={`border w-full max-w-md p-6 md:p-8 rounded-[2.5rem] shadow-2xl animate-fadeIn relative overflow-y-auto overflow-x-hidden max-h-[90vh] ${isDarkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-200"}`}>
                        <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>Edit Workout</h2>
                            <button onClick={() => setEditModal(false)} className={`transition-all p-3 rounded-xl ${isDarkMode ? "text-gray-400 hover:text-white bg-white/5 hover:bg-white/10" : "text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200"}`}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="space-y-1.5">
                                <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Workout Name</label>
                                <input
                                    value={workoutName}
                                    onChange={(e) => setWorkoutName(e.target.value)}
                                    placeholder="E.g., Chest Day"
                                    className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-blue-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Workout Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-blue-500 appearance-none cursor-pointer ${isDarkMode ? "bg-[#111] text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`}
                                >
                                    <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>Strength</option>
                                    <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>Cardio</option>
                                    <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>HIIT</option>
                                    <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>Yoga</option>
                                </select>
                            </div>

                            <div className={`pt-4 border-t ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
                                <label className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2 block">Add Exercises</label>
                                <input
                                    value={exerciseName}
                                    onChange={(e) => setExerciseName(e.target.value)}
                                    placeholder="Exercise Name"
                                    className={`w-full p-3 rounded-xl outline-none border transition-all focus:border-blue-500 mb-3 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`}
                                />

                                <div className="flex gap-2 mb-4">
                                    <input value={sets} onChange={(e) => setSets(e.target.value)} placeholder="Sets" type="number" className={`w-1/3 p-3 rounded-xl outline-none border placeholder-gray-600 focus:border-blue-500 text-center ${isDarkMode ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`} />
                                    <input value={reps} onChange={(e) => setReps(e.target.value)} placeholder="Reps" type="number" className={`w-1/3 p-3 rounded-xl outline-none border placeholder-gray-600 focus:border-blue-500 text-center ${isDarkMode ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`} />
                                    <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time(s)" type="number" className={`w-1/3 p-3 rounded-xl outline-none border placeholder-gray-600 focus:border-blue-500 text-center ${isDarkMode ? "bg-white/5 text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`} />
                                </div>
                                <button onClick={addExercise} className={`w-full font-semibold py-2.5 rounded-xl border transition-all ${isDarkMode ? "bg-white/10 hover:bg-white/20 text-white border-white/10" : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200"}`}>
                                            <span className="flex items-center justify-center gap-2"><FaPlus /> Add to List</span>
                                </button>
                            </div>

                            {/* SHOW EXERCISES */}
                            {exerciseList.length > 0 && (
                                <div className={`rounded-xl p-3 max-h-40 overflow-y-auto border space-y-2 mt-4 ${isDarkMode ? "bg-black/40 border-white/5" : "bg-gray-50 border-gray-200"}`}>
                                    {exerciseList.map((ex, i) => (
                                        <div key={i} className={`flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0 ${isDarkMode ? "border-white/5" : "border-gray-200"}`}>
                                            <div>
                                                <span className={`font-medium block ${isDarkMode ? "text-white" : "text-gray-800"}`}>{ex.name}</span>
                                                <span className={`px-2.5 py-1 rounded-md mt-1.5 inline-block text-[11px] font-bold tracking-wide uppercase ${isDarkMode ? "text-blue-400 bg-blue-500/10" : "text-blue-700 bg-blue-100"}`}>{ex.sets} sets • {ex.reps} reps • {ex.time}s</span>
                                            </div>
                                            <button
                                                onClick={() => deleteExercise(i)}
                                                className="text-red-500 hover:text-red-600 bg-red-500/10 hover:bg-red-500/20 p-2.5 rounded-xl transition-all"
                                                title="Remove exercise"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={updateWorkout}
                                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-black font-extrabold text-lg py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95 mt-6"
                            >
                                UPDATE PLAN
                            </button>
                        </div>
                    </div>
                </div>
            )}



        </div>
 
    )

}

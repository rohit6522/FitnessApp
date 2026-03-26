import Navbar from "../components/Navbar"
import { useState, useEffect } from "react"
import { API } from "../api"
import { toast } from "sonner"

export default function Plan() {

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    const [activeDay, setActiveDay] = useState("Thu")
    const [workouts, setWorkouts] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const [workoutName, setWorkoutName] = useState("")
    const [type, setType] = useState("Strength")

    const [exerciseName, setExerciseName] = useState("")
    const [sets, setSets] = useState("")
    const [reps, setReps] = useState("")
    const [time, setTime] = useState("")

    const [exerciseList, setExerciseList] = useState([])

    // FETCH
    useEffect(() => {
        const fetch = async () => {
            const res = await API.get(`/workouts/${activeDay}`)
            setWorkouts(res.data)
        }
        fetch()
    }, [activeDay])

    // ADD EXERCISE
    const addExercise = () => {
        if (!exerciseName) return

        const newExercise = { name: exerciseName, sets, reps, time }

        setExerciseList([...exerciseList, newExercise])

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


    // DELETE
    const deleteWorkout = async (id) => {
        await API.delete(`/workouts/${id}`)
        setWorkouts(workouts.filter(w => w._id !== id))
    }

    return (
        <div className="min-h-screen bg-gray-950 relative overflow-hidden p-6">
            {/* Glowing Orbs for Aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Navbar />

                {/* HEADER */}
                <h1 className="text-4xl font-black text-white mb-8 tracking-tight">
                    My <span className="text-lime-500">Plan</span>
                </h1>

                {/* DAYS SELECTOR */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                                activeDay === day
                                    ? "bg-gradient-to-r from-lime-500 to-emerald-500 text-black shadow-[0_0_20px_rgba(132,204,22,0.4)] scale-105"
                                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* WORKOUT LIST OR EMPTY STATE */}
                {workouts.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 border-dashed p-20 text-center rounded-3xl shadow-lg transition-all hover:bg-white/10">
                        <p className="text-gray-400 font-medium mb-6 text-lg">
                            No workout planned for <span className="text-lime-500 font-bold">{activeDay}</span>
                        </p>

                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-white/10 text-white font-bold px-8 py-3 rounded-xl border border-white/20 hover:bg-lime-500 hover:text-black hover:border-lime-500 transition-all duration-300"
                        >
                            + Add Workout
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {workouts.map(w => (
                            <div key={w._id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-[50px] group-hover:bg-lime-500/20 transition-all duration-500 pointer-events-none"></div>
                                
                                <div className="flex justify-between items-start relative z-10 mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">{w.name}</h2>
                                        <span className="inline-block px-3 py-1 bg-white/10 text-lime-400 text-xs font-semibold rounded-lg tracking-wider uppercase">{w.type}</span>
                                    </div>

                                    <button
                                        onClick={() => deleteWorkout(w._id)}
                                        className="text-gray-500 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all"
                                        title="Delete Workout"
                                    >
                                        ✖
                                    </button>
                                </div>

                                {/* EXERCISES */}
                                <div className="space-y-2 relative z-10">
                                    {w.exercises?.map((ex, i) => (
                                        <div key={i} className="flex justify-between items-center bg-black/40 p-3.5 rounded-xl border border-white/5">
                                            <p className="text-white font-medium">{ex.name}</p>
                                            <p className="text-lime-500 text-sm font-bold bg-lime-500/10 px-3 py-1 rounded-lg">
                                                {ex.sets} sets • {ex.reps} reps • {ex.time}s
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl animate-fadeIn relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-lime-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                        
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center py-12 relative z-10 animate-fadeIn">
                                <div className="w-24 h-24 bg-gradient-to-r from-lime-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_40px_rgba(132,204,22,0.6)] mb-6">
                                    <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinelinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-black text-white tracking-tight">Plan Created!</h2>
                                <p className="text-gray-400 mt-2 font-medium text-sm">Get ready to crush it 💪</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h2 className="text-2xl font-black text-white tracking-tight">Create Workout</h2>
                                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-xl">✖</button>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Workout Name</label>
                                        <input
                                            value={workoutName}
                                            onChange={(e) => setWorkoutName(e.target.value)}
                                            placeholder="E.g., Chest Day"
                                            className="w-full p-3.5 rounded-xl bg-white/5 text-white outline-none border border-white/10 placeholder-gray-600 transition-all focus:bg-white/10 focus:border-lime-500"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Workout Type</label>
                                        <select
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="w-full p-3.5 rounded-xl bg-[#111] text-white outline-none border border-white/10 transition-all focus:border-lime-500 appearance-none cursor-pointer"
                                        >
                                            <option className="bg-gray-900">Strength</option>
                                            <option className="bg-gray-900">Cardio</option>
                                            <option className="bg-gray-900">HIIT</option>
                                            <option className="bg-gray-900">Yoga</option>
                                        </select>
                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <label className="text-xs font-semibold text-lime-500 uppercase tracking-wider mb-2 block">Add Exercises</label>
                                        <input
                                            value={exerciseName}
                                            onChange={(e) => setExerciseName(e.target.value)}
                                            placeholder="Exercise Name"
                                            className="w-full p-3 rounded-xl bg-white/5 text-white outline-none border border-white/10 placeholder-gray-600 transition-all focus:bg-white/10 focus:border-lime-500 mb-3"
                                        />

                                        <div className="flex gap-2 mb-4">
                                            <input value={sets} onChange={(e) => setSets(e.target.value)} placeholder="Sets" type="number" className="w-1/3 p-3 rounded-xl bg-white/5 text-white outline-none border border-white/10 placeholder-gray-600 focus:border-lime-500 text-center" />
                                            <input value={reps} onChange={(e) => setReps(e.target.value)} placeholder="Reps" type="number" className="w-1/3 p-3 rounded-xl bg-white/5 text-white outline-none border border-white/10 placeholder-gray-600 focus:border-lime-500 text-center" />
                                            <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="Time(s)" type="number" className="w-1/3 p-3 rounded-xl bg-white/5 text-white outline-none border border-white/10 placeholder-gray-600 focus:border-lime-500 text-center" />
                                        </div>
                                        <button onClick={addExercise} className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 rounded-xl border border-white/10 transition-all">
                                            + Add to List
                                        </button>
                                    </div>

                                    {/* SHOW EXERCISES */}
                                    {exerciseList.length > 0 && (
                                        <div className="bg-black/40 rounded-xl p-3 max-h-40 overflow-y-auto border border-white/5 space-y-2 mt-4">
                                            {exerciseList.map((ex, i) => (
                                                <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                                    <span className="text-white font-medium">{ex.name}</span>
                                                    <span className="text-lime-500 bg-lime-500/10 px-2 py-1 rounded-md">{ex.sets} sets • {ex.reps} reps • {ex.time}s</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={createPlan}
                                        className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-extrabold text-lg py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] active:scale-95 mt-6"
                                    >
                                        CREATE PLAN
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
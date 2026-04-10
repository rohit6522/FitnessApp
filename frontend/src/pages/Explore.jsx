import Navbar from "../components/Navbar"
import { useState } from "react"

export default function Explore() {

    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("All Muscles")
    const [showDropdown, setShowDropdown] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme === "dark" : true;
    })

    const fitnessTips = [
        { title: "Stay Hydrated", tip: "Drink at least 8 glasses of water daily. During workouts, sip water every 15-20 minutes." },
        { title: "Progressive Overload", tip: "Gradually increase weight, reps, or sets to keep challenging your muscles for growth." },
        { title: "Rest & Recovery", tip: "Muscles grow during rest. Get 7-9 hours of sleep and take rest days between intense sessions." },
        { title: "Protein Intake", tip: "Aim for 1.6-2.2g of protein per kg of body weight daily for optimal muscle recovery." },
        { title: "Warm Up Always", tip: "Spend 5-10 minutes warming up to prevent injuries and improve workout performance." },
        { title: "Mind-Muscle Connection", tip: "Focus on the muscle being worked. This improves activation and leads to better results." },
    ]

    const exercises = [
        //Chest
        { name: "Bench Press", type: "strength", level: "Intermediate", muscle: "Chest", desc: "Barbell chest press", tip: "Keep feet flat" },
        { name: "Push Ups", type: "strength", level: "Beginner", muscle: "Chest", desc: "Bodyweight chest exercise", tip: "Keep body straight" },

         { name: "Incline Dumbbell Press", type: "strength", level: "Intermediate", muscle: "Chest", desc: "Targets upper chest", tip: "Set bench to 30-45 degrees" },
        { name: "Cable Crossovers", type: "strength", level: "Advanced", muscle: "Chest", desc: "Constant tension chest fly", tip: "Squeeze at the center" },


        // Back
        { name: "Pull Ups", type: "strength", level: "Intermediate", muscle: "Back", desc: "Bodyweight back exercise", tip: "Full range motion" },
        { name: "Deadlift", type: "strength", level: "Advanced", muscle: "Back", desc: "Compound lift", tip: "Keep bar close" },

         { name: "Barbell Rows", type: "strength", level: "Intermediate", muscle: "Back", desc: "Thickens the mid-back", tip: "Keep back straight and parallel to floor" },
        { name: "Lat Pulldowns", type: "strength", level: "Beginner", muscle: "Back", desc: "Machine back exercise", tip: "Pull to your upper chest" },


        // Shoulders

        { name: "Shoulder Press", type: "strength", level: "Intermediate", muscle: "Shoulders", desc: "Overhead press", tip: "Brace core" },
        { name: "Lateral Raises", type: "strength", level: "Beginner", muscle: "Shoulders", desc: "Dumbbell raise", tip: "Lift to shoulder height" },

        { name: "Front Raises", type: "strength", level: "Beginner", muscle: "Shoulders", desc: "Isolates front delts", tip: "Don't swing your body" },
        { name: "Face Pulls", type: "strength", level: "Intermediate", muscle: "Shoulders", desc: "Rear delt and posture", tip: "Pull towards your nose" },



        // Arms

        { name: "Bicep Curls", type: "strength", level: "Beginner", muscle: "Arms", desc: "Dumbbell curls", tip: "Keep elbows tight" },
        { name: "Tricep Dips", type: "strength", level: "Intermediate", muscle: "Arms", desc: "Bodyweight dips", tip: "Control movement" },

                { name: "Hammer Curls", type: "strength", level: "Beginner", muscle: "Arms", desc: "Builds brachialis", tip: "Neutral grip throughout" },
        { name: "Tricep Pushdowns", type: "strength", level: "Beginner", muscle: "Arms", desc: "Cable tricep extension", tip: "Lock elbows at your sides" },



        //Legs
        
        { name: "Squats", type: "strength", level: "Intermediate", muscle: "Legs", desc: "Barbell squat", tip: "Keep knees aligned" },
        { name: "Lunges", type: "strength", level: "Beginner", muscle: "Legs", desc: "Walking lunges", tip: "Step forward properly" },

         { name: "Leg Press", type: "strength", level: "Beginner", muscle: "Legs", desc: "Machine leg press", tip: "Don't lock your knees" },
        { name: "Calf Raises", type: "strength", level: "Beginner", muscle: "Legs", desc: "Builds lower legs", tip: "Pause at the top" },
        { name: "Romanian Deadlift", type: "strength", level: "Intermediate", muscle: "Legs", desc: "Hamstring focus", tip: "Hinge at the hips" },



        //Core
        
        { name: "Plank", type: "strength", level: "Beginner", muscle: "Core", desc: "Core hold", tip: "Keep hips level" },
        { name: "Russian Twists", type: "strength", level: "Intermediate", muscle: "Core", desc: "Core rotation", tip: "Engage abs" },

         { name: "Hanging Leg Raises", type: "strength", level: "Advanced", muscle: "Core", desc: "Lower ab focus", tip: "Avoid swinging" },
        { name: "Ab Wheel Rollout", type: "strength", level: "Advanced", muscle: "Core", desc: "Intense core stretch", tip: "Keep lower back rounded slightly" },


        // Full Body

        { name: "Burpees", type: "hiit", level: "Intermediate", muscle: "Full Body", desc: "Explosive exercise", tip: "Move fast" },
        { name: "Mountain Climbers", type: "hiit", level: "Beginner", muscle: "Full Body", desc: "Dynamic plank", tip: "Keep core tight" },

          { name: "Kettlebell Swings", type: "hiit", level: "Intermediate", muscle: "Full Body", desc: "Hip hinge power", tip: "Drive with your hips, not arms" },
        { name: "Thrusters", type: "hiit", level: "Advanced", muscle: "Full Body", desc: "Squat to press", tip: "Use momentum from the squat" },

        //Cardio

        { name: "Running", type: "cardio", level: "Beginner", muscle: "Cardio", desc: "Steady running", tip: "Maintain pace" },
        { name: "Cycling", type: "cardio", level: "Beginner", muscle: "Cardio", desc: "Bike workout", tip: "Adjust seat height" },

        { name: "Jump Rope", type: "cardio", level: "Beginner", muscle: "Cardio", desc: "High calorie burn", tip: "Stay on your toes" },
        { name: "Rowing", type: "cardio", level: "Intermediate", muscle: "Cardio", desc: "Full body cardio", tip: "Push with legs, then pull" },
        { name: "Stair Master", type: "cardio", level: "Intermediate", muscle: "Cardio", desc: "Continuous climbing", tip: "Don't lean on the rails" }
    
    ]
    

    const muscles = [
        "All Muscles",
        "Chest",
        "Back",
        "Shoulders",
        "Arms",
        "Legs",
        "Core",
        "Full Body",
        "Cardio"
    ]

    const filtered = exercises.filter(ex =>
        (filter === "All Muscles" || ex.muscle === filter) &&
        ex.name.toLowerCase().includes(search.toLowerCase())
    )

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

                {/* HEADER */}
                <h1 className={`text-4xl font-black mb-8 tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Explore <span className="text-lime-500">Fitness</span>
                </h1>

                {/* FITNESS TIPS */}
                <div className="mb-12">
                    <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        💡 <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-500 to-emerald-500">Quick Tips</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fitnessTips.map((item, i) => (
                            <div key={i} className={`backdrop-blur-xl border p-6 rounded-3xl shadow-lg transition-all duration-300 group relative overflow-hidden ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-gray-200 hover:bg-gray-50"}`}>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-lime-500/10 rounded-full blur-[40px] group-hover:bg-lime-500/20 transition-all duration-500 pointer-events-none"></div>
                                <h3 className={`text-lg font-bold mb-2 relative z-10 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{item.title}</h3>
                                <p className={`text-sm leading-relaxed relative z-10 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{item.tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* EXERCISE LIBRARY HEADER */}
                <h2 className={`text-3xl font-black mb-6 tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Exercise <span className="text-lime-500">Library</span>
                </h2>

                {/* SEARCH + FILTER */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 relative z-50">
                    <input
                        placeholder="Search exercises..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`flex-1 p-3.5 rounded-xl outline-none border transition-all focus:border-lime-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-white text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-gray-50 shadow-sm"}`}
                    />

                    {/* FILTER */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className={`w-full md:w-auto px-6 py-3.5 border rounded-xl transition-colors flex items-center justify-between gap-3 font-medium shadow-sm ${isDarkMode ? "bg-white/5 border-white/10 text-white hover:bg-white/10" : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"}`}
                        >
                            <span>{filter}</span>
                            <span className="text-xs">▼</span>
                        </button>

                        {showDropdown && (
                            <div className={`absolute right-0 mt-2 w-full md:w-48 border shadow-2xl rounded-xl overflow-hidden z-50 ${isDarkMode ? "bg-[#111] border-white/10" : "bg-white border-gray-200"}`}>
                                {muscles.map(m => (
                                    <div
                                        key={m}
                                        onClick={() => {
                                            setFilter(m)
                                            setShowDropdown(false)
                                        }}
                                        className={`p-3 cursor-pointer text-sm transition-colors ${filter === m ? (isDarkMode ? "bg-lime-500/20 text-lime-400 font-bold" : "bg-lime-100 text-lime-700 font-bold") : (isDarkMode ? "text-gray-400 hover:bg-white/10 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")}`}
                                    >
                                        {m}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {filtered.length === 0 ? (
                        <div className={`col-span-full backdrop-blur-xl border border-dashed p-16 text-center rounded-3xl shadow-lg transition-all ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-300"}`}>
                            <p className={`font-medium text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No exercises found for "{search}" in {filter}.</p>
                        </div>
                    ) : (
                        filtered.map((ex, i) => (
                            <div key={i} className={`backdrop-blur-xl border p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${isDarkMode ? "bg-white/5 border-white/10 hover:border-lime-500/30 hover:shadow-[0_0_30px_rgba(132,204,22,0.1)]" : "bg-white border-gray-200 hover:border-lime-500/50 hover:shadow-xl"}`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 rounded-full blur-[50px] group-hover:bg-lime-500/20 transition-all duration-500 pointer-events-none"></div>
                                
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{ex.name}</h2>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            <span className={`px-3 py-1 text-[10px] font-bold rounded-lg tracking-wider uppercase ${isDarkMode ? "bg-white/10 text-lime-400" : "bg-lime-100 text-lime-700"}`}>{ex.type}</span>
                                            <span className={`px-3 py-1 text-[10px] font-bold rounded-lg tracking-wider uppercase ${isDarkMode ? "bg-white/10 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>{ex.level}</span>
                                            <span className={`px-3 py-1 text-[10px] font-bold rounded-lg tracking-wider uppercase ${isDarkMode ? "bg-white/10 text-blue-400" : "bg-blue-100 text-blue-700"}`}>{ex.muscle}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 relative z-10">
                                    <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{ex.desc}</p>
                                    <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-black/40 border-white/5" : "bg-gray-50 border-gray-200"}`}>
                                        <p className="text-lime-500 text-xs font-semibold uppercase tracking-wider mb-1">💡 Pro Tip</p>
                                        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{ex.tip}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
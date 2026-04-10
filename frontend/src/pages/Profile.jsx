import Navbar from "../components/Navbar"
import { useState, useEffect } from "react"
import { API } from "../api"
import { toast } from "sonner"
import { FaUserCircle, FaCamera } from "react-icons/fa"

export default function Profile() {

    const [form, setForm] = useState({
        name: "",
        age: "",
        weight: "",
        height: "",
        goal: "General Fitness",
        level: "Beginner",
        profilePic: ""
    })
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme === "dark" : true;
    })

    const [time, setTime] = useState("")

    const setReminder = async () => {
        if (!time) {
            toast.error("Please select a time ⏰")
            return
        }

        try {
            const user = JSON.parse(localStorage.getItem("user"))
            await API.post("/reminder/set", {
                email: user.email,
                time
            })
            localStorage.setItem("workoutReminderTime", time)
            
            // Clear the "already notified today" flag so it can ring again today!
            localStorage.removeItem("lastNotifiedDate") 
            
            toast.success(`Daily reminder set for ${time} ✅`)
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to set reminder ❌")
        }
    }


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/profile")
                const localPic = localStorage.getItem("profilePic")
                // If a profile exists, fill the form
                if (res.data && Object.keys(res.data).length > 0) {
                    setForm({ ...res.data, profilePic: res.data.profilePic || localPic || "" })
                } else {
                    // Otherwise, clear it out for the new user
                    setForm({
                        name: "", age: "", weight: "", height: "",
                        goal: "General Fitness", level: "Beginner", profilePic: localPic || ""
                    })
                }
            } catch (err) {
                const localPic = localStorage.getItem("profilePic")
                // Also clear it if the backend returns an error (like 404 Not Found)
                setForm({
                    name: "", age: "", weight: "", height: "",
                    goal: "General Fitness", level: "Beginner", profilePic: localPic || ""
                })
            }
        }
        fetchProfile()
    }, [])

    // In-App Notification Checker
    useEffect(() => {
        const interval = setInterval(() => {
            const reminderTime = localStorage.getItem("workoutReminderTime");
            if (reminderTime) {
                const now = new Date();
                const currentTime = now.toTimeString().slice(0, 5); // Gets "HH:mm"
                const lastNotified = localStorage.getItem("lastNotifiedDate");
                const today = now.toDateString();

                if (currentTime === reminderTime && lastNotified !== today) {
                    toast.success("⏰ Time to Crush Your Workout!", {
                        description: "Your daily reminder is ringing! Let's get to work 💪"
                    });
                    localStorage.setItem("lastNotifiedDate", today);
                }
            }
        }, 10000); // Checks every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // Profile Picture Uploader
    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setForm({ ...form, profilePic: reader.result })
                try {
                    localStorage.setItem("profilePic", reader.result)
                } catch (error) {
                    console.warn("Image is too large to cache in localStorage")
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const saveProfile = async () => {
        try {
            await API.post("/profile", form)
            toast.success("Profile Saved ✅")
        } catch (err) {
            console.log(err.response?.data || err.message)
            toast.error("Save failed ❌")
        }
    }

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    }

    // Extracted Tailwind classes to reduce code size and repetition
    const labelClass = `text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`
    const inputClass = `w-full p-3.5 rounded-xl outline-none border transition-all focus:border-lime-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`
    const selectClass = `w-full p-3.5 rounded-xl outline-none border transition-all focus:border-lime-500 appearance-none cursor-pointer ${isDarkMode ? "bg-[#111] text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`
    const optionClass = isDarkMode ? "bg-gray-900" : "bg-white"

    return (
        <div className={`min-h-screen relative overflow-hidden p-4 md:p-6 transition-colors duration-500 ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
            {/* Glowing Orbs for Aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                {/* SMART REMINDER CARD */}
                <div className={`max-w-3xl mx-auto backdrop-blur-xl border p-6 md:p-8 rounded-[2rem] shadow-lg relative overflow-hidden mt-6 transition-all duration-700 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6 ${isDarkMode ? "bg-gradient-to-br from-blue-900/10 to-purple-900/10 border-white/10" : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"}`}>
                    <div className="absolute top-[-50%] left-[-10%] w-48 h-48 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <h2 className={`text-2xl font-black tracking-tight flex items-center gap-2 mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            ⏰ Daily <span className="text-blue-500">Workout Reminder</span>
                        </h2>
                        <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Get a daily email alert so you never miss a workout!
                        </p>
                    </div>

                    <div className="flex w-full md:w-auto gap-3 relative z-10">
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={`p-3.5 rounded-xl outline-none border transition-all focus:border-blue-500 flex-1 md:w-40 font-bold ${isDarkMode ? "bg-black/40 text-white border-white/10" : "bg-white text-gray-900 border-gray-200 shadow-sm"}`}
                        />
                        <button
                            onClick={setReminder}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-black font-extrabold px-6 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95 whitespace-nowrap"
                        >
                            Set Alert
                        </button>
                    </div>
                </div>


                <div className={`max-w-3xl mx-auto backdrop-blur-xl border p-6 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden mt-6 transition-all duration-700 hover:shadow-[0_0_40px_rgba(132,204,22,0.15)] hover:border-lime-500/30 ${isDarkMode ? "bg-gradient-to-br from-white/10 to-white/5 border-white/10" : "bg-gradient-to-br from-white to-gray-50 border-gray-200"}`}>
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-lime-500/20 rounded-full blur-[100px] pointer-events-none transition-transform duration-700 hover:scale-110"></div>

                    <div className="relative z-10">
                        {/* PROFILE PIC & HEADER SECTION */}
                        <div className="flex flex-col items-center justify-center mb-10">
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group cursor-pointer">
                                    <label className="cursor-pointer block relative">

                                        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 transition-all duration-500 group-hover:border-lime-500 shadow-2xl ${isDarkMode ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-100"}`}>

                                            {form.profilePic ? (
                                                <img src={form.profilePic} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <FaUserCircle className={`w-full h-full p-4 transition-transform duration-500 group-hover:scale-110 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                                            )}
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300 backdrop-blur-sm">
                                            <FaCamera className="text-3xl mb-1 animate-bounce" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Update</span>
                                        </div>
                                        
                                        {/* Input handles image upload seamlessly */}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                </div>
                                
                                {/* Option to explicitly remove the Profile Picture if one is set */}
                                {form.profilePic && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForm({ ...form, profilePic: "" })
                                            localStorage.removeItem("profilePic")
                                        }}
                                        className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider mt-4 transition-colors"
                                    >
                                        Remove Picture
                                    </button>
                                )}
                            </div>
                            <h1 className={`text-4xl md:text-5xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                My <span className="text-lime-500">Profile</span>
                            </h1>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className={labelClass}>Full Name</label>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" className={inputClass} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Age</label>
                                    <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age" className={inputClass} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Weight (kg)</label>
                                    <input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="Weight" className={inputClass} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Height (cm)</label>
                                    <input name="height" type="number" value={form.height} onChange={handleChange} placeholder="Height" className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Primary Goal</label>
                                    <select name="goal" value={form.goal} onChange={handleChange} className={selectClass}>
                                        <option className={optionClass}>General Fitness</option>
                                        <option className={optionClass}>Weight Loss</option>
                                        <option className={optionClass}>Muscle Gain</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className={labelClass}>Experience Level</label>
                                    <select name="level" value={form.level} onChange={handleChange} className={selectClass}>
                                        <option className={optionClass}>Beginner</option>
                                        <option className={optionClass}>Intermediate</option>
                                        <option className={optionClass}>Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={saveProfile}
                                className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-extrabold text-lg py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] active:scale-95 mt-6"
                            >
                                SAVE PROFILE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}
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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/profile")
                // If a profile exists, fill the form
                if (res.data && Object.keys(res.data).length > 0) {
                    setForm(res.data)
                } else {
                    // Otherwise, clear it out for the new user
                    setForm({
                        name: "", age: "", weight: "", height: "",
                        goal: "General Fitness", level: "Beginner", profilePic: ""
                    })
                }
            } catch (err) {
                // Also clear it if the backend returns an error (like 404 Not Found)
                setForm({
                    name: "", age: "", weight: "", height: "",
                    goal: "General Fitness", level: "Beginner", profilePic: ""
                })
            }
        }
        fetchProfile()
    }, [])

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

    return (
        <div className={`min-h-screen relative overflow-hidden p-4 md:p-6 transition-colors duration-500 ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
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
                

                <div className={`max-w-3xl mx-auto backdrop-blur-xl border p-6 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden mt-6 transition-all duration-700 hover:shadow-[0_0_40px_rgba(132,204,22,0.15)] hover:border-lime-500/30 ${isDarkMode ? "bg-gradient-to-br from-white/10 to-white/5 border-white/10" : "bg-gradient-to-br from-white to-gray-50 border-gray-200"}`}>
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-lime-500/20 rounded-full blur-[100px] pointer-events-none transition-transform duration-700 hover:scale-110"></div>

                    <div className="relative z-10">
                        {/* PROFILE PIC & HEADER SECTION */}
                        <div className="flex flex-col items-center justify-center mb-10">
                            <div className="relative group cursor-pointer mb-6">
                                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 transition-all duration-500 group-hover:border-lime-500 shadow-2xl ${isDarkMode ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-100"}`}>
                                    {form.profilePic ? (
                                        <img src={form.profilePic} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <FaUserCircle className={`w-full h-full p-4 transition-transform duration-500 group-hover:scale-110 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
                                    )}
                                </div>
                                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300 cursor-pointer backdrop-blur-sm">
                                    <FaCamera className="text-3xl mb-1 animate-bounce" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Update</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <h1 className={`text-4xl md:text-5xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                My <span className="text-lime-500">Profile</span>
                            </h1>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Full Name</label>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-lime-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Age</label>
                                    <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age" className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-lime-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Weight (kg)</label>
                                    <input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="Weight" className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-lime-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Height (cm)</label>
                                    <input name="height" type="number" value={form.height} onChange={handleChange} placeholder="Height" className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-lime-500 ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-600 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Primary Goal</label>
                                    <select name="goal" value={form.goal} onChange={handleChange} className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-lime-500 appearance-none cursor-pointer ${isDarkMode ? "bg-[#111] text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`}>
                                        <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>General Fitness</option>
                                        <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>Weight Loss</option>
                                        <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>Muscle Gain</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Experience Level</label>
                                    <select name="level" value={form.level} onChange={handleChange} className={`w-full p-3.5 rounded-xl outline-none border transition-all focus:border-lime-500 appearance-none cursor-pointer ${isDarkMode ? "bg-[#111] text-white border-white/10" : "bg-gray-50 text-gray-900 border-gray-200"}`}>
                                        <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>Beginner</option>
                                        <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>Intermediate</option>
                                        <option className={isDarkMode ? "bg-gray-900" : "bg-white"}>Advanced</option>
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
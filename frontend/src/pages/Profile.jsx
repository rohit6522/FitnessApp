import Navbar from "../components/Navbar"
import { useState, useEffect } from "react"
import { API } from "../api"
import { toast } from "sonner"

export default function Profile() {

    const [form, setForm] = useState({
        name: "",
        age: "",
        weight: "",
        height: "",
        goal: "General Fitness",
        level: "Beginner"
    })
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme === "dark" : true;
    })

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await API.get("/profile")
            if (res.data) setForm(res.data)
        }
        fetchProfile()
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
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

                <div className={`max-w-4xl mx-auto backdrop-blur-xl border p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden mt-6 transition-colors duration-500 ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="relative z-10">
                        <h1 className={`text-4xl font-black mb-8 tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            My <span className="text-lime-500">Profile</span>
                        </h1>

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
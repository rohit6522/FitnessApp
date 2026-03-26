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

    return (
        <div className="min-h-screen bg-gray-950 relative overflow-hidden p-6">
            {/* Glowing Orbs for Aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <Navbar />

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden mt-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="relative z-10">
                        <h1 className="text-4xl font-black text-white mb-8 tracking-tight">
                            My <span className="text-lime-500">Profile</span>
                        </h1>

                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" className="w-full p-3.5 rounded-xl bg-white/5 text-white outline-none border border-white/10 placeholder-gray-600 transition-all focus:bg-white/10 focus:border-lime-500" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Age</label>
                                    <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age" className="w-full p-3.5 rounded-xl bg-white/5 text-white outline-none border border-white/10 placeholder-gray-600 transition-all focus:bg-white/10 focus:border-lime-500" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Weight (kg)</label>
                                    <input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="Weight" className="w-full p-3.5 rounded-xl bg-white/5 text-white outline-none border border-white/10 placeholder-gray-600 transition-all focus:bg-white/10 focus:border-lime-500" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Height (cm)</label>
                                    <input name="height" type="number" value={form.height} onChange={handleChange} placeholder="Height" className="w-full p-3.5 rounded-xl bg-white/5 text-white outline-none border border-white/10 placeholder-gray-600 transition-all focus:bg-white/10 focus:border-lime-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Primary Goal</label>
                                    <select name="goal" value={form.goal} onChange={handleChange} className="w-full p-3.5 rounded-xl bg-[#111] text-white outline-none border border-white/10 transition-all focus:border-lime-500 appearance-none cursor-pointer">
                                        <option className="bg-gray-900">General Fitness</option>
                                        <option className="bg-gray-900">Weight Loss</option>
                                        <option className="bg-gray-900">Muscle Gain</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Experience Level</label>
                                    <select name="level" value={form.level} onChange={handleChange} className="w-full p-3.5 rounded-xl bg-[#111] text-white outline-none border border-white/10 transition-all focus:border-lime-500 appearance-none cursor-pointer">
                                        <option className="bg-gray-900">Beginner</option>
                                        <option className="bg-gray-900">Intermediate</option>
                                        <option className="bg-gray-900">Advanced</option>
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
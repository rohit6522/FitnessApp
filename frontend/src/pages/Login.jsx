import { useState } from "react"
import { API } from "../api"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await API.post("/auth/login", form)

            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", JSON.stringify(res.data.user))

            toast.success("Login successful! 🚀")
            navigate("/dashboard")
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid credentials ❌")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
            </div>

            {/* Glowing Orbs for Trending Aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-lime-500/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }}></div>

            <div className="z-10 flex w-full max-w-[1000px] h-[600px] mx-4 rounded-3xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-500">

                {/* LEFT FORM */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="max-w-md w-full mx-auto animate-fadeIn">
                        
                        <div className="mb-8 text-center md:text-left">
                            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">
                                FIT<span className="text-lime-500">NESS</span>
                            </h1>
                            <p className="text-gray-400 font-medium tracking-wide text-sm">Push your limits. Track your gains.</p>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-6 text-center md:text-left">Log In</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3.5 rounded-xl bg-black/30 text-white outline-none border border-white/10 placeholder-gray-500 transition-all duration-300 focus:bg-black/50 focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-semibold text-gray-300">Password</label>
                                    <span
                                        onClick={() => navigate("/forgot")}
                                        className="text-xs text-lime-500 cursor-pointer hover:text-lime-400 transition-colors"
                                    >
                                        Forgot Password?
                                    </span>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3.5 rounded-xl bg-black/30 text-white outline-none border border-white/10 placeholder-gray-500 transition-all duration-300 focus:bg-black/50 focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
                                />
                            </div>

                            <button 
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-extrabold text-lg py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? "Authenticating..." : "LOG IN"}
                        </button>

                            <p className="text-sm text-center text-gray-400 pt-4">
                            Don't have an account?{" "}
                            <span
                                onClick={() => navigate("/signup")}
                                    className="text-lime-500 font-semibold cursor-pointer hover:underline"
                            >
                                    Join Now
                            </span>
                        </p>

                            <div className="flex justify-center mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2 group"
                                >
                                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
                                </button>
                            </div>
                    </form>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="w-1/2 hidden md:block relative overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop"
                        alt="Gym Workout"
                        className="h-full w-full object-cover object-center transition-transform duration-[10s] hover:scale-110"
                    />
                    {/* Gradient Overlay for blending */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Motivational Quote */}
                    <div className="absolute bottom-12 right-8 left-12 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl">
                        <p className="text-white text-lg font-medium italic leading-relaxed">"The only bad workout is the one that didn't happen."</p>
                        <p className="text-lime-500 text-sm mt-3 font-bold uppercase tracking-wider">— Fitness</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
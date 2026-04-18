import { useState } from "react"
import { API } from "../api"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function Forgot() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const sendOTP = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await API.post("/auth/forgot-password", { email })
            toast.success("OTP sent to your email 📩")
            navigate("/reset")
        } catch (err) {
            toast.error(err.response?.data?.message || "Error sending OTP ❌")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop')" }}
            >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
            </div>

            {/* Glowing Orbs for Trending Aesthetic */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-rose-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }}></div>

            <div className="z-10 flex w-full max-w-[1000px] h-[600px] mx-4 rounded-3xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-500">

                {/* LEFT FORM */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="max-w-md w-full mx-auto animate-fadeIn">
                        
                        <div className="mb-8 text-center md:text-left">
                            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">
                                FIT<span className="text-orange-500">NESS</span>
                            </h1>
                            <p className="text-gray-400 font-medium tracking-wide text-sm">Reset your password and continue the grind.</p>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-6 text-center md:text-left">Forgot Password</h2>

                        <form onSubmit={sendOTP} className="space-y-5">

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-3.5 rounded-xl bg-black/30 text-white outline-none border border-white/10 placeholder-gray-500 transition-all duration-300 focus:bg-black/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                                />
                            </div>

                            <button 
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-black font-extrabold text-lg py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? "Sending..." : "SEND OTP"}
                            </button>

                            <div className="flex justify-center mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/login")}
                                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group mt-4"
                                >
                                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="w-1/2 hidden md:block relative overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1571019614242-c5c5adee9f50?q=80&w=2070&auto=format&fit=crop"
                        alt="Gym Equipment"
                        className="h-full w-full object-cover object-center transition-transform duration-[10s] hover:scale-110"
                    />
                    {/* Gradient Overlay for blending */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Motivational Quote */}
                    <div className="absolute bottom-12 right-8 left-12 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl">
                        <p className="text-white text-lg font-medium italic leading-relaxed">"It’s not about having time. It’s about making time."</p>
                        <p className="text-orange-500 text-sm mt-3 font-bold uppercase tracking-wider">— Fitness</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
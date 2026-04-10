import { useState } from "react"
import { API } from "../api"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
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
            setTimeout(() => {
                window.location.href = "/dashboard"
            }, 500)
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid credentials ❌")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
    try {
        // 1. Show Google Popup
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // 2. Send Google User Data to your Backend
        const response = await API.post("/auth/google", {
            name: user.displayName,
            email: user.email,
            googleId: user.uid,
            profilePicture: user.photoURL,
        });

        // 3. Save your Backend's JWT token and redirect
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Google Login successful! 🚀");
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 500);
        
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        const errorMsg = error.response?.data?.message || error.message || "Failed to authenticate";
        if (error.code === 'auth/popup-closed-by-user') {
             toast.error("Google sign-in was cancelled.");
        } else {
             toast.error(`Google Error: ${errorMsg} ❌`);
        }
    }
};




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

            <div className="z-10 flex w-full max-w-[900px] h-auto md:h-[550px] mx-4 rounded-3xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-500">

                {/* LEFT FORM */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center relative">
                    <div className="max-w-md w-full mx-auto animate-fadeIn">
                        
                        <div className="mb-5 text-center md:text-left">
                            <h1 className="text-3xl font-black text-white mb-1 tracking-tighter">
                                FIT<span className="text-lime-500">NESS</span>
                            </h1>
                            <p className="text-gray-400 font-medium tracking-wide text-sm">Push your limits. Track your gains.</p>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-4 text-center md:text-left">Log In</h2>

                        <form onSubmit={handleSubmit} className="space-y-3">

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 rounded-xl bg-black/30 text-white outline-none border border-white/10 placeholder-gray-500 transition-all duration-300 focus:bg-black/50 focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
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
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 pr-10 rounded-xl bg-black/30 text-white outline-none border border-white/10 placeholder-gray-500 transition-all duration-300 focus:bg-black/50 focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-lime-500 transition-colors"
                                        title={showPassword ? "Hide Password" : "Show Password"}
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-extrabold text-lg py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? "Authenticating..." : "LOG IN"}
                        </button>

                    <button 
                        type="button" 
                        onClick={handleGoogleSignIn} 
                        className="w-full bg-white text-black font-extrabold text-lg py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95 flex items-center justify-center gap-3 mt-3"
                    >
                        <FcGoogle className="text-2xl" /> Continue with Google 
                    </button>

                            <p className="text-sm text-center text-gray-400 pt-2">
                            Don't have an account?{" "}
                            <span
                                onClick={() => navigate("/signup")}
                                    className="text-lime-500 font-semibold cursor-pointer hover:underline"
                            >
                                    Join Now
                            </span>
                        </p>

                            <div className="flex justify-center mt-3">
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
                        src="https://www.kreedon.com/_next/image?url=https%3A%2F%2Fwww.kreedon.in%2Fwp-content%2Fuploads%2F2023%2F07%2F029_SD_07172007ca473-358a4bcdaf960e3d6d2c4865d79e4e96.jpg&w=3840&q=70"
                        alt="The Great Khali"
                        className="h-full w-full object-cover object-center transition-transform duration-[10s] hover:scale-110"
                    />
                    {/* Gradient Overlay for blending */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Motivational Quote */}
                    <div className="absolute bottom-12 right-8 left-12 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl">
                        <p className="text-white text-lg font-medium italic leading-relaxed">"I have struggled hard to attain this fame."</p>
                        <p className="text-lime-500 text-sm mt-3 font-bold uppercase tracking-wider">— The Great Khali</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
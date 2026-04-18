import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { FaBars, FaTimes } from "react-icons/fa"

export default function Navbar({ isDarkMode = true, toggleTheme }) {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("chatHistory")
        window.location.href = "/"
    }

        

    return (
        <div className={`p-4 backdrop-blur-xl border shadow-2xl rounded-2xl mb-6 relative z-50 transition-colors duration-500 ${isDarkMode ? "bg-[#0a0a0a]/80 border-white/10" : "bg-white/80 border-gray-200"}`}>
            <div className="flex items-center justify-between">

                {/* LEFT: LOGO */}
                <div className="md:w-1/3">
                    <h1 className={`text-2xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        FIT<span className="text-orange-500">NESS</span>
                    </h1>
                </div>

                {/* MOBILE HAMBURGER BUTTON */}
                <div className="md:hidden flex items-center gap-3">
                    {toggleTheme && (
                        <button
                            onClick={toggleTheme}
                            title="Toggle Theme"
                            className={`p-2 rounded-full font-bold transition-all duration-300 border shadow-sm flex items-center justify-center ${isDarkMode ? "bg-white/10 text-yellow-300 border-white/20 hover:bg-white/20" : "bg-white text-indigo-500 border-gray-300 hover:bg-gray-100"}`}
                        >
                            {isDarkMode ? "☀️" : "🌙"}
                        </button>
                    )}
                    <button onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-xl transition-all ${isDarkMode ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`}>
                        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* DESKTOP CENTER: NAVIGATION LINKS */}
                <div className="hidden md:flex w-1/3 justify-center items-center gap-6">

                    {token && (
                        <>
                            <Link to="/dashboard" className={`relative hover:text-orange-500 font-semibold transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-orange-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Dashboard
                            </Link>
                            <Link to="/plan" className={`relative hover:text-orange-500 font-semibold transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-orange-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                My Plan
                            </Link>
                            <Link to="/profile" className={`relative hover:text-orange-500  font-semibold transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-orange-500  after:transition-transform after:duration-300 hover:after:scale-x-100 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Profile
                            </Link>
                            <Link to="/explore" className={`relative hover:text-orange-500  font-semibold transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-orange-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Explore
                            </Link>
                            <Link to="/track" className={`relative hover:text-orange-500  font-semibold transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-orange-500  after:transition-transform after:duration-300 hover:after:scale-x-100 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                                Track
                            </Link>
                        </>
                    )}
                </div>

                {/* DESKTOP RIGHT: LOGOUT & USER */}
                <div className="hidden md:flex w-1/3 justify-end items-center gap-4">
                    {toggleTheme && (
                        <button
                            onClick={toggleTheme}
                            title="Toggle Theme"
                            className={`p-2.5 rounded-full font-bold transition-all duration-300 border shadow-sm flex items-center justify-center hover:scale-110 ${isDarkMode ? "bg-white/10 text-yellow-300 border-white/20 hover:bg-white/20" : "bg-white text-indigo-500 border-gray-300 hover:bg-gray-100"}`}
                        >
                            {isDarkMode ? "☀️" : "🌙"}
                        </button>
                    )}
                    
                    {!token ? (
                        <Link
                            to="/login"
                            className="bg-orange-500  text-black px-6 py-2 rounded-xl font-bold hover:bg-orange-500  hover:scale-[1.05] transition-all shadow-[0_0_15px_rgba(132,204,22,0.4)]"
                        >
                            Login
                        </Link>
                    ) : (
                        <>
                            <span className={`font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                👋 {user?.name}
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-500/20 text-red-500 border border-red-500/50 px-5 py-1.5 rounded-xl hover:bg-red-500 hover:text-white font-bold transition-all"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            {isOpen && (
                <div className={`absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl border shadow-2xl flex flex-col gap-2 md:hidden animate-fadeIn ${isDarkMode ? "bg-[#0a0a0a]/95 border-white/10" : "bg-white/95 border-gray-200"} backdrop-blur-xl`}>
                    {token ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} className={`block p-3 rounded-xl font-semibold transition-colors ${isDarkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}>Dashboard</Link>
                            <Link to="/plan" onClick={() => setIsOpen(false)} className={`block p-3 rounded-xl font-semibold transition-colors ${isDarkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}>My Plan</Link>
                            <Link to="/profile" onClick={() => setIsOpen(false)} className={`block p-3 rounded-xl font-semibold transition-colors ${isDarkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}>Profile</Link>
                            <Link to="/explore" onClick={() => setIsOpen(false)} className={`block p-3 rounded-xl font-semibold transition-colors ${isDarkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}>Explore</Link>

                            <Link to="/track" onClick={() => setIsOpen(false)} className={`block p-3 rounded-xl font-semibold transition-colors ${isDarkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-gray-100"}`}>Track</Link>

                            <div className={`pt-4 mt-2 border-t flex justify-between items-center ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
                                <span className={`font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>👋 {user?.name}</span>
                                <button onClick={logout} className="bg-red-500/20 text-red-500 border border-red-500/50 px-5 py-2 rounded-xl hover:bg-red-500 hover:text-white font-bold transition-all">Logout</button>
                            </div>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)} className="bg-orange-500  text-black text-center px-6 py-3 rounded-xl font-bold hover:bg-orange-500  transition-all">Login</Link>
                    )}
                </div>
            )}
        </div>
    )
}
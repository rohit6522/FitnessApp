import { Link, useNavigate } from "react-router-dom"

export default function Navbar({ isDarkMode = true }) {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/")
    }

    return (
        <div className={`flex items-center justify-between p-4 backdrop-blur-xl border shadow-2xl rounded-2xl mb-6 relative z-10 transition-colors duration-500 ${isDarkMode ? "bg-[#0a0a0a]/80 border-white/10" : "bg-white/80 border-gray-200"}`}>

            {/* LEFT: LOGO */}
            <div className="w-1/3">
                <h1 className={`text-2xl font-black tracking-tighter ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    FIT<span className="text-lime-500">NESS</span>
                </h1>
            </div>

            {/* CENTER: NAVIGATION LINKS */}
            <div className="w-1/3 flex justify-center items-center gap-6">

                {token && (
                    <>
                        <Link
                            to="/dashboard"
                            className={`hover:text-lime-500 font-semibold transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/plan"
                            className={`hover:text-lime-500 font-semibold transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                        >
                            My Plan
                        </Link>

                        <Link to="/profile"
                            className={`hover:text-lime-500 font-semibold transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                        >
                            Profile
                        </Link>

                        <Link to="/explore"
                            className={`hover:text-lime-500 font-semibold transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                        >
                            Explore
                        </Link>

                        <Link to="/track" 
                            className={`hover:text-lime-500 font-semibold transition-colors ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Track
                        </Link>
                    </>
                )}
            </div>

            {/* RIGHT: LOGOUT & USER */}
            <div className="w-1/3 flex justify-end items-center gap-4">
                {!token ? (
                    <Link
                        to="/login"
                        className="bg-lime-500 text-black px-6 py-2 rounded-xl font-bold hover:bg-lime-400 hover:scale-[1.05] transition-all shadow-[0_0_15px_rgba(132,204,22,0.4)]"
                    >
                        Login
                    </Link>
                ) : (
                    <>
                        {/* USER NAME */}
                        <span className={`font-medium hidden sm:block ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
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
    )
}
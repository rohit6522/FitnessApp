import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/")
    }

    return (
        <div className="flex items-center justify-between p-4 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl mb-6 relative z-10">

            {/* LEFT: LOGO */}
            <div className="w-1/3">
                <h1 className="text-2xl font-black text-white tracking-tighter">
                    FIT<span className="text-lime-500">NESS</span>
                </h1>
            </div>

            {/* CENTER: NAVIGATION LINKS */}
            <div className="w-1/3 flex justify-center items-center gap-6">

                {!token ? (
                    <Link
                        to="/login"
                        className="text-gray-300 hover:text-white font-semibold transition-colors"
                    >
                        Login
                    </Link>
                ) : (
                    <>
                        <Link
                            to="/dashboard"
                            className="text-gray-300 hover:text-lime-500 font-semibold transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/plan"
                            className="text-gray-300 hover:text-lime-500 font-semibold transition-colors"
                        >
                            My Plan
                        </Link>

                        <Link to="/profile" 
                         className="text-gray-300 hover:text-lime-500 font-semibold transition-colors"
                        >
                            Profile
                        </Link>
                    </>
                )}
            </div>

            {/* RIGHT: LOGOUT & USER */}
            <div className="w-1/3 flex justify-end items-center gap-4">
                {token && (
                    <>
                        {/* USER NAME */}
                        <span className="font-medium text-gray-400 hidden sm:block">
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
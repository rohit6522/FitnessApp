import { Link, useNavigate } from "react-router-dom"

export default function Navbar() {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/")
    }

    return (
        <div className="flex justify-between items-center p-4 bg-black text-white">
            
            <h1 className="text-xl font-bold">Fitness</h1>

            <div className="space-x-4">

                {!token ? (
                    <Link 
                        to="/login"
                        className="bg-white text-black px-4 py-1 rounded"
                    >
                        Login
                    </Link>
                ) : (
                    <>
                        <Link 
                            to="/dashboard"
                            className="bg-white text-black px-4 py-1 rounded"
                        >
                            Dashboard
                        </Link>

                        <button 
                            onClick={logout}
                            className="bg-red-500 px-4 py-1 rounded"
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>

        </div>
    )
}
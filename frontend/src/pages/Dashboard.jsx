import Navbar from "../components/Navbar"

export default function Dashboard() {

    const user = JSON.parse(localStorage.getItem("user"))

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-lime-500 selection:text-black">
            <Navbar />

            <div className="p-6 max-w-7xl mx-auto mt-10 text-center animate-fadeIn">

                {!user ? (
                    <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl max-w-2xl mx-auto mt-20">
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                            Welcome to FIT<span className="text-lime-500">NESS</span> 🚀
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Push your limits. Track your gains. Please login to access your personalized dashboard.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl mt-10">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                            Welcome back, <span className="text-lime-500">{user.name}</span> 👋
                        </h1>
                        <p className="text-gray-400 mt-4 text-lg">Let's crush today's workout.</p>
                    </div>
                )}

            </div>
        </div>
    )
}
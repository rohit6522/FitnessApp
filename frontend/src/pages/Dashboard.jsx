import Navbar from "../components/Navbar"
import { useState, useEffect } from "react"
import { API } from "../api"
import { FaFire, FaCalendarCheck, FaBolt, FaClipboardList, FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const MOTIVATIONAL_QUOTES = [
    "Ready to crush your goals? Track your progress and push your limits today!",
    "Sweat is just fat crying. Keep pushing!",
    "Your only bad workout is the one that didn't happen.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Push yourself, because no one else is going to do it for you."
];

const GUEST_QUOTES = [
    "The ultimate platform to plan your routines, track your workouts, and hit your goals.",
    "Join the elite and start your fitness journey today.",
    "Your body can stand almost anything. It's your mind that you have to convince.",
    "Push harder than yesterday if you want a different tomorrow."
];

export default function Dashboard() {

    const user = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate()

    const [workouts, setWorkouts] = useState([])
    const [input, setInput] = useState("")
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme === "dark" : true;
    })
    const [displayedName, setDisplayedName] = useState("")
    const [displayedQuote, setDisplayedQuote] = useState("")
    const [displayedGuestQuote, setDisplayedGuestQuote] = useState("")
    const [displayedHeading, setDisplayedHeading] = useState("")

    const [stats, setStats] = useState({
        thisWeek: 0,
        calories: 0,
        streak: 0
    })


    useEffect(() => {
        // toast.success("Working")   
        const fetchWorkouts = async () => {
            try {
                const res = await API.get("/workouts")
                console.log(res.data)
                setWorkouts(res.data)
            } catch (err) {
                console.log("Error:", err)
            }
        }

        if (user) fetchWorkouts()
    }, [])

    useEffect(() => {
        const fetchStats = async () => {
            const user = JSON.parse(localStorage.getItem("user"))
            if (!user) return

            try {
                const res = await API.get(`/track/stats/${user._id || user.id}`)
                setStats(res.data)
            } catch (err) {
                console.error("Error fetching stats:", err)
            }
        }

        fetchStats()
        
        // Poll every 5 seconds to keep stats updated in real-time
        const intervalId = setInterval(fetchStats, 5000)
        return () => clearInterval(intervalId)
    }, [])

    // Typing Effect for User Name
    useEffect(() => {
        if (!user?.name) return;

        let isMounted = true;
        const animateText = async () => {
            while (isMounted) {
                // 1. Type the name forward
                for (let i = 0; i <= user.name.length; i++) {
                    if (!isMounted) return;
                    setDisplayedName(user.name.slice(0, i));
                    await new Promise(resolve => setTimeout(resolve, 120)); // Typing speed
                }

                // 2. Wait for 3 seconds
                await new Promise(resolve => setTimeout(resolve, 3000));

                // 3. Delete the name backward
                for (let i = user.name.length; i >= 0; i--) {
                    if (!isMounted) return;
                    setDisplayedName(user.name.slice(0, i));
                    await new Promise(resolve => setTimeout(resolve, 60)); // Erasing speed
                }

                // 4. Brief pause before typing again
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        };

        animateText();

        return () => { isMounted = false; };
    }, [user?.name]);

    // Typing Effect for Motivational Quotes
    useEffect(() => {
        let isMounted = true;
        const animateQuotes = async () => {
            let quoteIndex = 0;
            while (isMounted) {
                const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];
                
                // 1. Type the quote forward
                for (let i = 0; i <= currentQuote.length; i++) {
                    if (!isMounted) return;
                    setDisplayedQuote(currentQuote.slice(0, i));
                    await new Promise(resolve => setTimeout(resolve, 50)); // Normal typing speed
                }

                // 2. Wait to let the user read it
                await new Promise(resolve => setTimeout(resolve, 3500));

                // 3. Delete the quote backward
                for (let i = currentQuote.length; i >= 0; i--) {
                    if (!isMounted) return;
                    setDisplayedQuote(currentQuote.slice(0, i));
                    await new Promise(resolve => setTimeout(resolve, 30)); // Erasing speed
                }

                // 4. Pause before next quote
                await new Promise(resolve => setTimeout(resolve, 500));

                // 5. Move to next quote
                quoteIndex = (quoteIndex + 1) % MOTIVATIONAL_QUOTES.length;
            }
        };

        animateQuotes();

        return () => { isMounted = false; };
    }, []);

    // Typing Effect for Guest Quotes
    useEffect(() => {
        let isMounted = true;
        const animateGuestQuotes = async () => {
            let quoteIndex = 0;
            while (isMounted) {
                const currentQuote = GUEST_QUOTES[quoteIndex];
                
                // 1. Type the quote forward
                for (let i = 0; i <= currentQuote.length; i++) {
                    if (!isMounted) return;
                    setDisplayedGuestQuote(currentQuote.slice(0, i));
                    await new Promise(resolve => setTimeout(resolve, 50)); // Normal typing speed
                }

                // 2. Wait to let the user read it
                await new Promise(resolve => setTimeout(resolve, 3500));

                // 3. Delete the quote backward
                for (let i = currentQuote.length; i >= 0; i--) {
                    if (!isMounted) return;
                    setDisplayedGuestQuote(currentQuote.slice(0, i));
                    await new Promise(resolve => setTimeout(resolve, 30)); // Erasing speed
                }

                // 4. Pause before next quote
                await new Promise(resolve => setTimeout(resolve, 500));

                // 5. Move to next quote
                quoteIndex = (quoteIndex + 1) % GUEST_QUOTES.length;
            }
        };

        animateGuestQuotes();

        return () => { isMounted = false; };
    }, []);

    // Typing Effect for Main Heading (Guest Page)
    useEffect(() => {
        let isMounted = true;
        const text = "Transform Your Body & Mind";
        const animateHeading = async () => {
            for (let i = 0; i <= text.length; i++) {
                if (!isMounted) return;
                setDisplayedHeading(text.slice(0, i));
                await new Promise(resolve => setTimeout(resolve, 40)); // Fast and smooth typing speed
            }
        };
        setTimeout(() => {
            if (isMounted) animateHeading();
        }, 200);

        return () => { isMounted = false; };
    }, []);

    // In-App Notification Checker
    useEffect(() => {
        const interval = setInterval(() => {
            const reminderTime = localStorage.getItem("workoutReminderTime");
            if (reminderTime) {
                const now = new Date();
                const currentTime = now.toTimeString().slice(0, 5); // Gets "HH:mm"
                const lastNotified = localStorage.getItem("lastNotifiedDate");
                const today = now.toDateString();

                if (currentTime === reminderTime && lastNotified !== today) {
                    toast.success("⏰ Time to Crush Your Workout!", {
                        description: "Your daily reminder is ringing! Let's get to work 💪"
                    });
                    localStorage.setItem("lastNotifiedDate", today);
                }
            }
        }, 10000); // Checks every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const addWorkout = async () => {
        try {
            const res = await API.post("/workouts", { name: input })
            setWorkouts([...workouts, res.data])
            setInput("")
        } catch (err) {
            console.log(err)
        }
    }



    const deleteWorkout = async (id) => {
        try {
            await API.delete(`/workouts/${id}`)
            setWorkouts(workouts.filter(w => w._id !== id))
        } catch (err) {
            console.log(err)
        }
    }

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    }

    return (
        <div className={`min-h-screen relative overflow-hidden p-4 md:p-6 transition-colors duration-500 ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
            {/* Glowing Orbs for Aesthetic */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }}></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                {user ? (
                    <>
                        {/* TOP BANNER FOR LOGGED-IN USERS */}
                        <div className={`backdrop-blur-xl border p-6 md:p-8 rounded-[2rem] mb-6 relative overflow-hidden shadow-2xl group transition-all duration-700 hover:shadow-[0_0_40px_rgba(132,204,22,0.15)] hover:border-lime-500/30 ${isDarkMode ? "bg-gradient-to-br from-white/10 to-white/5 border-white/10" : "bg-gradient-to-br from-white to-gray-50 border-gray-200"}`}>
                            <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-lime-500/20 rounded-full blur-[100px] group-hover:bg-lime-500/30 group-hover:scale-110 transition-all duration-700 pointer-events-none"></div>
                            <div className="relative z-10">
                                <p className="text-sm font-extrabold text-lime-500 mb-2 tracking-widest uppercase flex items-center gap-2">
                                    <FaBolt className="animate-pulse" /> Welcome back
                                </p>
                                <h1 className={`text-3xl md:text-5xl font-black mb-3 tracking-tighter flex flex-wrap items-center gap-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                    <span>{displayedName}<span className="animate-pulse font-light opacity-50">|</span></span>
                                    <span className="inline-block hover:animate-bounce cursor-default transition-all">👋</span>
                                </h1>
                                <p className={`font-medium text-base md:text-lg max-w-xl leading-relaxed min-h-[3rem] ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    {displayedQuote}<span className="animate-pulse font-light opacity-50">|</span>
                                </p>
                            </div>
                        </div>

                        {/* STATS CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {/* Card 1 */}
                            <div className={`backdrop-blur-xl border p-6 rounded-[2rem] shadow-lg flex flex-col justify-between relative overflow-hidden group transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] duration-500 ${isDarkMode ? "bg-white/5 border-white/10 hover:border-blue-500/50 hover:bg-white/10" : "bg-white border-gray-200 hover:border-blue-500/50 hover:bg-gray-50"}`}>
                                <div className="absolute -right-2 -bottom-2 text-7xl opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 text-blue-500"><FaCalendarCheck /></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-3 rounded-xl ${isDarkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}><FaCalendarCheck className="text-xl" /></div>
                                        <p className={`font-bold uppercase tracking-wider text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>This Week</p>
                                    </div>
                                    <p className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>{stats.thisWeek} <span className="text-lg font-bold text-gray-500">Days</span></p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className={`backdrop-blur-xl border p-6 rounded-[2rem] shadow-lg flex flex-col justify-between relative overflow-hidden group transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(249,115,22,0.3)] duration-500 ${isDarkMode ? "bg-white/5 border-white/10 hover:border-orange-500/50 hover:bg-white/10" : "bg-white border-gray-200 hover:border-orange-500/50 hover:bg-gray-50"}`}>
                                <div className="absolute -right-2 -bottom-2 text-7xl opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 text-orange-500"><FaFire /></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-3 rounded-xl ${isDarkMode ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"}`}><FaFire className="text-xl" /></div>
                                        <p className={`font-bold uppercase tracking-wider text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Day Streak</p>
                                    </div>
                                    <p className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>{stats.streak} <span className="text-lg font-bold text-gray-500">🔥</span></p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className={`backdrop-blur-xl border p-6 rounded-[2rem] shadow-lg flex flex-col justify-between relative overflow-hidden group transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(234,179,8,0.3)] duration-500 ${isDarkMode ? "bg-white/5 border-white/10 hover:border-yellow-500/50 hover:bg-white/10" : "bg-white border-gray-200 hover:border-yellow-500/50 hover:bg-gray-50"}`}>
                                <div className="absolute -right-2 -bottom-2 text-7xl opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 text-yellow-500"><FaBolt /></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-3 rounded-xl ${isDarkMode ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-600"}`}><FaBolt className="text-xl" /></div>
                                        <p className={`font-bold uppercase tracking-wider text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Calories</p>
                                    </div>
                                    <p className={`text-4xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>{stats.calories} <span className="text-lg font-bold text-gray-500">kcal</span></p>
                                </div>
                            </div>
                        </div>

                        {/* ACTION CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                                onClick={() => navigate("/plan")}
                                className={`group cursor-pointer backdrop-blur-xl border p-6 rounded-[2rem] shadow-lg relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(132,204,22,0.4)] ${isDarkMode ? "bg-white/5 border-white/10 hover:border-lime-500/50 hover:bg-lime-500/5" : "bg-white border-gray-200 hover:border-lime-500/50 hover:bg-lime-50"}`}
                            >
                                <div className="absolute top-0 right-0 w-48 h-48 bg-lime-500/10 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h3 className={`text-xl font-black mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>My Workout Plan</h3>
                                        <p className={`font-medium text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>View and edit your daily schedule</p>
                                    </div>
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-lime-400 to-emerald-500 text-black flex items-center justify-center text-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                        <FaClipboardList />
                                    </div>
                                </div>
                            </div>

                            <div 
                                onClick={() => navigate("/explore")}
                                className={`group cursor-pointer backdrop-blur-xl border p-6 rounded-[2rem] shadow-lg relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)] ${isDarkMode ? "bg-white/5 border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5" : "bg-white border-gray-200 hover:border-emerald-500/50 hover:bg-emerald-50"}`}
                            >
                                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <h3 className={`text-xl font-black mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Browse Exercises</h3>
                                        <p className={`font-medium text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Discover routines & form tips</p>
                                    </div>
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-black flex items-center justify-center text-xl shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                                        <FaSearch />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* LANDING PAGE FOR GUESTS / LOGGED OUT USERS */
                    <div className="flex flex-col items-center justify-center text-center py-10 md:py-16 px-4 relative z-10">
                        <h1 className={`text-5xl md:text-6xl font-black mb-4 tracking-tighter min-h-[3rem] md:min-h-[3.75rem] ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {displayedHeading.slice(0, 15)}
                            {displayedHeading.length > 15 && <span className="text-lime-500">{displayedHeading.slice(15, 19)}</span>}
                            {displayedHeading.length > 19 && displayedHeading.slice(19, 22)}
                            {displayedHeading.length > 22 && <span className="text-emerald-500">{displayedHeading.slice(22, 26)}</span>}
                            <span className="animate-pulse font-light opacity-50">|</span>
                        </h1>
                        <p className={`text-sm md:text-base max-w-xl mx-auto mb-6 leading-relaxed min-h-[4rem] md:min-h-[4.5rem] ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {displayedGuestQuote}<span className="animate-pulse font-light opacity-50">|</span>
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button
                                onClick={() => navigate("/signup")}
                                className="bg-gradient-to-r from-lime-500 to-emerald-500 text-black font-extrabold text-sm px-6 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(132,204,22,0.4)] active:scale-95"
                            >
                                START FOR FREE
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className={`font-extrabold text-sm px-6 py-2.5 rounded-xl transition-all duration-300 border hover:-translate-y-1 ${isDarkMode ? "bg-white/5 text-white border-white/10 hover:bg-white/10" : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"}`}
                            >
                                LOG IN
                            </button>
                        </div>

                        {/* Feature Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full text-left">
                            <div className={`backdrop-blur-xl border p-5 rounded-3xl shadow-lg transition-all hover:-translate-y-2 duration-500 ${isDarkMode ? "bg-white/5 border-white/10 hover:border-lime-500/50 hover:bg-white/10" : "bg-white border-gray-200 hover:border-lime-500/50 hover:bg-gray-50"}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 shadow-md ${isDarkMode ? "bg-lime-500/20 text-lime-400" : "bg-lime-100 text-lime-600"}`}><FaClipboardList /></div>
                                <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Smart Planning</h3>
                                <p className={`text-xs md:text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Create custom workout plans tailored to your specific fitness goals and weekly schedule.</p>
                            </div>
                            <div className={`backdrop-blur-xl border p-5 rounded-3xl shadow-lg transition-all hover:-translate-y-2 duration-500 ${isDarkMode ? "bg-white/5 border-white/10 hover:border-blue-500/50 hover:bg-white/10" : "bg-white border-gray-200 hover:border-blue-500/50 hover:bg-gray-50"}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 shadow-md ${isDarkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600"}`}><FaCalendarCheck /></div>
                                <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Track Progress</h3>
                                <p className={`text-xs md:text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Log every set, rep, and calorie burned. Watch your consistency turn into real results.</p>
                            </div>
                            <div className={`backdrop-blur-xl border p-5 rounded-3xl shadow-lg transition-all hover:-translate-y-2 duration-500 ${isDarkMode ? "bg-white/5 border-white/10 hover:border-orange-500/50 hover:bg-white/10" : "bg-white border-gray-200 hover:border-orange-500/50 hover:bg-gray-50"}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 shadow-md ${isDarkMode ? "bg-orange-500/20 text-orange-400" : "bg-orange-100 text-orange-600"}`}><FaFire /></div>
                                <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Build Streaks</h3>
                                <p className={`text-xs md:text-sm leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Stay motivated by maintaining your daily workout streaks and hitting new personal bests.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
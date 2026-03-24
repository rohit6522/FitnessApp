import { useState } from "react"
import { API } from "../api"
import { useNavigate } from "react-router-dom"

export default function Forgot() {
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const sendOTP = async () => {
        try {
            await API.post("/auth/forgot-password", { email })
            alert("OTP sent to your email 📩")
            navigate("/reset")
        } catch (err) {
            alert("Error sending OTP")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-blue-200">

            <div className="bg-white/40 backdrop-blur-lg p-8 rounded-xl shadow-lg w-80 animate-fadeIn">

                <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

                <input
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />

                <button
                    onClick={sendOTP}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:scale-105 transition"
                >
                    Send OTP
                </button>

                <p 
                    onClick={() => navigate("/login")}
                    className="text-sm text-center mt-3 text-blue-500 cursor-pointer"
                >
                    Back to Login
                </p>

            </div>
        </div>
    )
}
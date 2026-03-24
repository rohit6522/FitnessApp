import { useState, useEffect } from "react"
import { API } from "../api"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function Reset() {
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [password, setPassword] = useState("")
    const [time, setTime] = useState(30)
    const navigate = useNavigate()

    // OTP INPUT CHANGE
    const handleOTPChange = (value, index) => {
        if (!/^\d?$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus()
        }
    }

    // BACKSPACE MOVE
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus()
        }
    }

    // AUTO PASTE OTP
    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").slice(0, 6)
        if (!/^\d+$/.test(paste)) return

        const newOtp = paste.split("")
        setOtp(newOtp)
    }

    // TIMER
    useEffect(() => {
        if (time > 0) {
            const timer = setTimeout(() => setTime(time - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [time])

    // RESET PASSWORD
    const resetPassword = async () => {
        try {
            const finalOtp = otp.join("")

            await API.post("/auth/reset-password", {
                email,
                otp: finalOtp,
                newPassword: password
            })

            toast.success("Password Updated ✅")
            navigate("/login")
        } catch (err) {
            toast.error("Invalid OTP ❌")
        }
    }

    // RESEND OTP
    const resendOTP = async () => {
        try {
            await API.post("/auth/forgot-password", { email })
            setTime(30)
            toast.success("OTP Resent 📩")
        } catch {
            toast.error("Error sending OTP")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-pink-200">

            <div className="bg-white/40 backdrop-blur-lg p-8 rounded-xl shadow-lg text-center w-[320px]">

                <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>

                <input
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />

                {/* OTP BOXES */}
                <div 
                    className="flex justify-center gap-2 mb-4"
                    onPaste={handlePaste}
                >
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            id={`otp-${i}`}
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOTPChange(e.target.value, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            className="w-10 h-10 text-center border rounded text-lg focus:ring-2 focus:ring-purple-400"
                        />
                    ))}
                </div>

                <input
                    type="password"
                    placeholder="New Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />

                <button
                    onClick={resetPassword}
                    className="w-full bg-green-500 text-white py-2 rounded hover:scale-105 transition"
                >
                    Reset Password
                </button>

                {/* RESEND */}
                <p 
                    onClick={() => time === 0 && resendOTP()}
                    className="mt-3 text-sm cursor-pointer"
                >
                    {time > 0 ? `Resend OTP in ${time}s` : "Resend OTP"}
                </p>

            </div>
        </div>
    )
}
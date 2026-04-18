import { useState, useRef, useEffect } from "react"
import { API } from "../api"
import { FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa"

export default function Chat() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem("chatHistory")
            if (saved) return JSON.parse(saved)
        } catch (e) {
            console.error("Error parsing chat history:", e)
        }
        
        // Get user's name for personalized greeting
        const userStr = localStorage.getItem("user")
        const user = userStr ? JSON.parse(userStr) : null
        const userName = user?.name ? user.name.split(" ")[0] : "there"
        return [{ sender: "bot", text: `Welcome back ${userName} 🎉 How can I assist you today?` }]
    })
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme")
        return savedTheme ? savedTheme === "dark" : true
    })

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen) {
            scrollToBottom()
        }
    }, [messages, isLoading, isOpen])

    // Save chat history to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("chatHistory", JSON.stringify(messages))
    }, [messages])

    const sendMessage = async () => {
        if (!input.trim()) return

        const userText = input
        setInput("") // Clear immediately for better UX

        const userMsg = { sender: "user", text: userText }
        const newMessages = [...messages, userMsg]
        
        setMessages(newMessages)
        setIsLoading(true)

        try {
            const history = newMessages.map(msg => ({
                role: msg.sender === "bot" ? "assistant" : "user",
                content: msg.text
            }))

            const res = await API.post("/chat", { message: userText, history })
            const botMsg = { sender: "bot", text: res.data.reply }
            setMessages(prev => [...prev, botMsg])
        } catch (err) {
            console.error("ChatBot Error:", err.response?.data || err.message);
            const serverError = err.response?.data?.error || "Oops! Something went wrong. Try again.";
            const errorMsg = { sender: "bot", text: serverError }
            setMessages(prev => [...prev, errorMsg])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !isLoading) {
            sendMessage()
        }
    }

    const clearChat = () => {
        const userStr = localStorage.getItem("user")
        const user = userStr ? JSON.parse(userStr) : null
        const userName = user?.name ? user.name.split(" ")[0] : "there"
        const initialMsg = [{ sender: "bot", text: `Welcome back ${userName} 🎉 How can I assist you today?` }]
        setMessages(initialMsg)
        localStorage.removeItem("chatHistory")
    }

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Chat Window */}
            <div 
                className={`mb-4 w-[20rem] md:w-[24rem] rounded-[2rem] shadow-2xl overflow-hidden border flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none absolute bottom-16 right-0"} ${isDarkMode ? "bg-gray-950 border-white/10" : "bg-white border-gray-200"}`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-4 flex justify-between items-center text-black">
                    <div className="flex items-center gap-2 font-black tracking-tight text-lg">
                        <FaCommentDots className="text-xl" /> AI Coach
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={clearChat}
                            className="text-xs font-bold bg-black/10 hover:bg-black/20 px-2 py-1 rounded-lg transition-colors"
                        >
                            Clear
                        </button>
                        <button 
                            onClick={() => setIsOpen(false)} 
                            className="p-1 rounded-full hover:bg-black/10 transition-colors"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`h-[24rem] p-4 overflow-y-auto flex flex-col gap-4 ${isDarkMode ? "bg-[#0a0a0a]" : "bg-gray-50"}`}>
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${m.sender === "user" ? "bg-orange-500 text-black rounded-br-none font-medium" : isDarkMode ? "bg-white/10 text-gray-200 rounded-bl-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"}`}>
                            <span className="whitespace-pre-wrap">{m.text}</span>
                            </div>
                        </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className={`p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5 ${isDarkMode ? "bg-white/10" : "bg-white border border-gray-200"}`}>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={`p-3 border-t flex items-center gap-2 ${isDarkMode ? "border-white/10 bg-[#0a0a0a]" : "border-gray-200 bg-white"}`}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about workouts..."
                        className={`flex-1 p-3 rounded-xl outline-none text-sm transition-all focus:border-orange-500 border ${isDarkMode ? "bg-white/5 text-white border-white/10 placeholder-gray-500 focus:bg-white/10" : "bg-gray-50 text-gray-900 border-gray-200 placeholder-gray-400 focus:bg-white"}`}
                    />
                    <button 
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="p-3.5 bg-orange-500 text-black rounded-xl hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        <FaPaperPlane size={14} />
                    </button>
                </div>
            </div>

            {/* Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full shadow-2xl flex items-center justify-center text-black hover:scale-110 transition-transform duration-300 z-50 absolute bottom-0 right-0 ${isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"}`}
            >
                <FaCommentDots size={28} />
            </button>
        </div>
    )
}
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Forgot from "./pages/Forgot"
import Reset from "./pages/Reset"
import Plan from "./pages/Plan"
import Profile from "./pages/Profile"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />   {/* 👈 home */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path="/reset" element={<Reset />} />
            <Route path="/profile" element={<Profile />} />

                <Route path="/plan" element={<Plan />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Forgot from "./pages/Forgot"
import Reset from "./pages/Reset"
import Profile from "./pages/Profile"
import Track from "./pages/Track"
import Explore from "./pages/Explore"
import Plan from "./pages/Plan"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path="/reset" element={<Reset />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/track" element={<Track />} />
                <Route path="/plan" element={<Plan />} />
                
                <Route path="/explore" element={<Explore />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
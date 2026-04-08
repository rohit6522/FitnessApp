import axios from "axios"

export const API = axios.create({
baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
})

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token")

    // console.log("TOKEN:", token) // 👈 DEBUG

    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }

    return req
})
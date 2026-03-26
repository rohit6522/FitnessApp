import axios from "axios"

export const API = axios.create({
    baseURL: "http://localhost:5000/api"
})

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token")

    console.log("TOKEN:", token) // 👈 DEBUG

    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }

    return req
})
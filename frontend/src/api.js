import axios from "axios"

export const API = axios.create({
    baseURL: "https://fitnessapp-backend-n0qo.onrender.com/api"  
})

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token")

    // console.log("TOKEN:", token) // 👈 DEBUG

    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }

    return req
})
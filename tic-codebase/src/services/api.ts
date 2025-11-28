import axios from "axios";

const api = axios.create({
    baseURL: "https://api.jobsapp.com/api", // Example backend base URL
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
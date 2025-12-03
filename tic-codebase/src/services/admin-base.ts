import axios from "axios";
import Cookies from "js-cookie";

const adminBaseApi = axios.create({
    baseURL: "http://3.26.114.105:8000/api/admin", // Example backend base URL
    headers: {
        "Content-Type": "application/json",
    },
});

adminBaseApi.interceptors.request.use(
    (config) => {
        const token = Cookies.get("access");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export default adminBaseApi;
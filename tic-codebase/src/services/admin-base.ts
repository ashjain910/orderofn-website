import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const adminBaseApi = axios.create({
    baseURL: "https://tic-api.orderofn.com/api/admin", // Example backend base URL
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

// Global response interceptor for 403 Forbidden
adminBaseApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            const detail = error.response.data.detail[0] || "Forbidden";
            toast.error(detail, { position: "top-right" });
            Cookies.remove("access");
            Cookies.remove("refresh");
            sessionStorage.clear();
            if (window.location.pathname.startsWith("/admin")) {
                window.location.href = "tic/admin/";
            } else {
                window.location.href = "/tic/";
            }
        }
        return Promise.reject(error);
    }
);
export default adminBaseApi;
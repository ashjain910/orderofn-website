
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const adminBaseApi = axios.create({
    baseURL: "http://192.168.0.108:8000/api/admin", // Example backend base URL
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
let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
}

adminBaseApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const errorData = error.response?.data;
        // Handle 401 or token_not_valid
        if (
            error.response &&
            error.response.status === 401 &&
            errorData &&
            (errorData.code === "token_not_valid" || (errorData.detail && errorData.detail.includes("token not valid"))) &&
            Cookies.get("refresh") &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return adminBaseApi(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                const refreshResponse = await axios.post(
                    "http://192.168.0.108:8000/api/token/refresh",
                    { refresh: Cookies.get("refresh") }
                );
                const newAccess = refreshResponse.data.access;
                if (newAccess) {
                    Cookies.set("access", newAccess, { secure: true });
                    processQueue(null, newAccess);
                    originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
                    return adminBaseApi(originalRequest);
                } else {
                    processQueue("No access token in refresh response", null);
                    Cookies.remove("access");
                    Cookies.remove("refresh");
                    sessionStorage.clear();
                    window.location.href = "/admin/";
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                Cookies.remove("access");
                Cookies.remove("refresh");
                sessionStorage.clear();
                window.location.href = "/admin/";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        // Handle 403 Forbidden (logout)
        if (error.response && error.response.status === 403) {
            const detail = error.response.data.detail?.[0] || error.response.data.detail || "Forbidden";
            toast.error(detail, { position: "top-right" });
            Cookies.remove("access");
            Cookies.remove("refresh");
            sessionStorage.clear();
            if (window.location.pathname.startsWith("/admin")) {
                window.location.href = "/#/admin/";
            } else {
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);
export default adminBaseApi;
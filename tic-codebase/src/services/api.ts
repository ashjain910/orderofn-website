import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const BaseApi = axios.create({
    baseURL: "https://tic-api.orderofn.com/api", // Example backend base URL
    headers: {
        "Content-Type": "application/json",
    },
});

BaseApi.interceptors.request.use(
    (config) => {
        const token = Cookies.get("access");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Global response interceptor for token refresh
let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
}

BaseApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const errorData = error?.response?.data;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            Cookies.get("refresh") &&
            (errorData?.code === "token_not_valid" || errorData?.detail?.includes("token not valid"))
        ) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        return BaseApi(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                const refreshResponse = await axios.post(
                    "https://tic-api.orderofn.com/api/token/refresh",
                    { refresh: Cookies.get("refresh") },
                    { headers: { "Content-Type": "application/json" } }
                );
                const newAccess = refreshResponse.data.access;
                if (newAccess) {
                    Cookies.set("access", newAccess, { secure: true });
                    processQueue(null, newAccess);
                    originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
                    return BaseApi(originalRequest);
                } else {
                    processQueue("No access token in refresh response", null);
                    Cookies.remove("access");
                    Cookies.remove("refresh");
                    sessionStorage.removeItem("user");
                    toast.error("Session expired. Please log in again.");
                    // Use SPA navigation event for logout
                    window.dispatchEvent(new CustomEvent("tic-logout"));
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                Cookies.remove("access");
                Cookies.remove("refresh");
                sessionStorage.removeItem("user");
                toast.error("Session expired. Please log in again.");
                window.dispatchEvent(new CustomEvent("tic-logout"));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default BaseApi;
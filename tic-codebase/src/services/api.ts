import axios from "axios";
import Cookies from "js-cookie";

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

export default BaseApi;
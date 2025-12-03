import axios from "axios";

const BaseApi = axios.create({
    baseURL: "http://3.26.114.105:8000/api", // Example backend base URL
    headers: {
        "Content-Type": "application/json",
    },
});

export default BaseApi;
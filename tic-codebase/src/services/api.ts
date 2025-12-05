import axios from "axios";

const BaseApi = axios.create({
    baseURL: "https://tic-api.orderofn.com/api", // Example backend base URL
    headers: {
        "Content-Type": "application/json",
    },
});

export default BaseApi;
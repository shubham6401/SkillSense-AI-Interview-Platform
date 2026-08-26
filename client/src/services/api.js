import axios from "axios";

let rawURL = import.meta.env.VITE_API_URL || "/api";
let baseURL = rawURL;
if (rawURL && rawURL.startsWith("http") && !rawURL.endsWith("/api")) {
    baseURL = `${rawURL.replace(/\/+$/, "")}/api`;
}

const api = axios.create({
    baseURL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

export default api;
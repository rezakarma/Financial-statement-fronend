import axios from "axios";
import Cookies from "js-cookie";

const app = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true,
    // timeout: 1,
});

app.interceptors.request.use(
    (config) => {
        if (config?.withCredentials && !!Cookies.get("Financial_statement_token")) {
            const token = Cookies.get("Financial_statement_token");
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    },
);

app.interceptors.response.use(
    (res) => res,
    (error) => {
        if (
            // canceled
            axios.isCancel(error) ||
            // failed
            error.code === "ERR_NETWORK" ||
            // timeout
            (error.code === "ECONNABORTED" && error.message.includes("timeout"))
        ) {
            console.log("Error:", error.message);
        } else {
            return Promise.reject(error);
        }
    }
);

const http = {
    get: app.get,
    post: app.post,
    delete: app.delete,
    put: app.put,
    patch: app.patch,
};

export const axiosInstance = app;
export default http;

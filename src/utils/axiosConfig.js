import axios from "axios";
import { loaderState } from "./loaderState";

const VITE_API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: VITE_API_URL,
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Track refresh state to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue = [];

// Process all requests that were queued while refreshing
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
    // If already refreshing, queue this request
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
        isRefreshing = false;
        handleLogout();
        return Promise.reject(new Error("No refresh token available"));
    }

    try {
        const response = await axios.post(
            `${VITE_API_URL}/api/auth/refresh-token`,
            {
                refresh: refreshToken,
                refresh_token: refreshToken
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        const newAccessToken = response.data.access;
        localStorage.setItem("access", newAccessToken);

        processQueue(null, newAccessToken);
        isRefreshing = false;
        return newAccessToken;

    } catch (error) {
        processQueue(error, null);
        isRefreshing = false;
        handleLogout();
        return Promise.reject(error);
    }
};

// Handle logout when tokens are invalid
const handleLogout = () => {
    localStorage.clear();
    if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
    }
};

// REQUEST INTERCEPTOR: Attach access token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        if (!config.skipGlobalLoader) {
            loaderState.showLoader();
        }

        const token = localStorage.getItem("access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        loaderState.hideLoader();
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR: Handle 401 errors and refresh token automatically
axiosInstance.interceptors.response.use(
    (response) => {
        if (!response.config.skipGlobalLoader) {
            loaderState.hideLoader();
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (!error.response) {
            if (!originalRequest.skipGlobalLoader) {
                loaderState.hideLoader();
            }
            return Promise.reject(error);
        }

        // If we get a 401 and haven't tried to refresh yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get a new access token
                const newToken = await refreshAccessToken();

                // Update the failed request with the new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                // Retry the original request
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                loaderState.hideLoader();
                return Promise.reject(refreshError);
            }
        }

        if (!originalRequest.skipGlobalLoader) {
            loaderState.hideLoader();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
export { refreshAccessToken as refreshSession };

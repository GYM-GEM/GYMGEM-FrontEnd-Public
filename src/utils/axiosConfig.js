import axios from "axios";
import { getTokenTimeRemaining, decodeToken } from "./auth.js";

const baseURL = import.meta.env.VITE_API_URL;

// ============================================================================
// AXIOS INSTANCE CONFIGURATION
// ============================================================================
const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 50000,
    headers: {
        "Content-Type": "application/json",
    },
});

// ============================================================================
// REFRESH TOKEN LOGIC (Concurrency + Queue)
// ============================================================================
let isRefreshing = false;
let failedQueue = [];

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

/**
 * Core function to handle token refreshing.
 * Handles concurrency using a queue system.
 */
const refreshAccessToken = async () => {
    // If already refreshing, return a promise that resolves when the current refresh finishes
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;
    const refreshToken = localStorage.getItem("refresh");

    if (!refreshToken) {
        handleLogout();
        return Promise.reject(new Error("No refresh token available"));
    }

    try {
        console.log("🔄 Refreshing access token...");

        // Send refresh token in the BODY
        // Sending both keys to handle different backend naming conventions (refresh vs refresh_token)
        const response = await axios.post(
            "http://127.0.0.1:8000/api/auth/refresh-token",
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

        console.log("✅ Token refreshed successfully");

        processQueue(null, newAccessToken);
        isRefreshing = false;
        return newAccessToken;

    } catch (error) {
        console.error("❌ Token refresh failed:", error);

        processQueue(error, null);
        isRefreshing = false;
        handleLogout();

        return Promise.reject(error);
    }
};

/**
 * Standardized logout function
 */
const handleLogout = () => {
    localStorage.clear();
    // Only redirect if not already on login/signup to avoid loops or jarring UX
    if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
    }
};

import { loaderState } from "./loaderState";

// ... existing code ...

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================
axiosInstance.interceptors.request.use(
    async (config) => {
        // Show loader for every request
        loaderState.showLoader();

        let token = localStorage.getItem("access");

        if (token) {
            // Check if token is expired or close to expiring (e.g., < 1 minute)
            // If so, refresh proactively BEFORE the request
            const timeRemaining = getTokenTimeRemaining(token);

            // If timeRemaining is 0 or negative, it's expired.
            // If it's less than 60 seconds, we treat it as "needs refresh" to be safe.
            if (timeRemaining < 60) {
                console.log(`⏰ Token expired or expires soon (${timeRemaining}s). Refreshing...`);
                try {
                    token = await refreshAccessToken();
                } catch (error) {
                    // If refresh fails, we've already logged out in refreshAccessToken
                    loaderState.hideLoader(); // Make sure to hide loader if we bail out
                    return Promise.reject(error);
                }
            }

            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        loaderState.hideLoader(); // Hide on request error
        return Promise.reject(error);
    }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================
axiosInstance.interceptors.response.use(
    (response) => {
        loaderState.hideLoader(); // Hide on success
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        // Skip if error has no response (network error)
        if (!error.response) {
            loaderState.hideLoader(); // Hide on network error
            return Promise.reject(error);
        }

        // Handle 401 Unauthorized
        if (error.response.status === 401 && !originalRequest._retry) {
            console.warn("⚠️ 401 Unauthorized detected. Attempting to refresh...");
            originalRequest._retry = true;

            try {
                // Note: refreshAccessToken uses axios directly, not axiosInstance, 
                // so it won't trigger the interceptor loop and won't double-count the loader.
                // However, we might want to keep the loader showing during refresh.
                // Since user didn't see loader hide yet (because this is an error interceptor), 
                // we technically "should" hide it, but we are about to retry. 
                // Actually, let's keep it shown implicitly or manage it carefully.
                // Simplest strategy: The loader counter is still incremented from the original request.
                // We haven't called hideLoader() for the original request yet in this path.
                
                const newToken = await refreshAccessToken();

                // Update header and retry original request
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                
                // When we retry, axiosInstance is called again -> ShowLoader called again.
                // So we have 2 shows.
                // We need to match the hides. 
                // The failed 401 "finished" but we intercepted it.
                // Let's call hideLoader() for the *failed* request before retrying?
                // Or just let the counter handle it. 
                // Request 1: Show (Count 1) -> Error 401. 
                // Retry Request 2: Show (Count 2) -> Success -> Hide (Count 1).
                // Then we return Request 2 result to caller of Request 1.
                // The caller of Request 1 receives response. 
                // Wait, the interceptor stack is tricky.
                
                // Let's just be safe: hide the loader for the *current* failed request before retrying.
                loaderState.hideLoader(); 

                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // Refresh failed (and logged out), reject the original request
                loaderState.hideLoader(); // Ensure we hide if refresh fails
                return Promise.reject(refreshError);
            }
        }

        loaderState.hideLoader(); // Hide on other errors
        return Promise.reject(error);
    }
);

// Export the refresh function so App.jsx can call it on load
export const refreshSession = refreshAccessToken;

export default axiosInstance;
export { checkTokensStatus } from "./auth.js";

// src/utils/axiosConfig.js
import axios from "axios";

/**
 * ============================================================================
 * AXIOS INSTANCE WITH AUTOMATIC TOKEN REFRESH
 * ============================================================================
 * 
 * This file creates a customized axios instance that automatically:
 * 1. Adds authentication tokens to every request
 * 2. Refreshes expired access tokens using the refresh token
 * 3. Retries failed requests after getting a new token
 * 4. Logs out users when refresh tokens expire
 * 
 * HOW IT WORKS:
 * -------------
 * When you make an API request:
 * → Request Interceptor adds "Authorization: Bearer {access_token}" header
 * → Request is sent to the backend
 * → If the token is valid, you get your data back ✓
 * → If the token expired (401 error), Response Interceptor catches it:
 *    - Calls the refresh endpoint with the refresh token
 *    - Gets a new access token
 *    - Updates localStorage
 *    - Retries the original request with the new token
 *    - Returns the data (user doesn't notice anything!)
 * → If refresh token also expired:
 *    - Clears all tokens
 *    - Redirects to login page
 */

// Create a custom axios instance (instead of using axios directly)
// This allows us to configure it exactly how we want
const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000", // Base URL for all requests
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * ============================================================================
 * REQUEST INTERCEPTOR
 * ============================================================================
 * This runs BEFORE every request is sent to the server.
 * It automatically attaches the access token to the Authorization header.
 */
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the access token from localStorage
        const token = localStorage.getItem("access");

        // If a token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config; // Continue with the request
    },
    (error) => {
        // If something went wrong before the request even started, reject it
        return Promise.reject(error);
    }
);

/**
 * ============================================================================
 * RESPONSE INTERCEPTOR
 * ============================================================================
 * This runs AFTER every response is received from the server.
 * It catches 401 errors (unauthorized) and attempts to refresh the token.
 */

// Track if we're currently refreshing the token (to prevent multiple simultaneous refreshes)
let isRefreshing = false;

// Queue of failed requests waiting for the token to be refreshed
let failedRequestsQueue = [];

/**
 * Process all queued requests after getting a new token
 * @param {string} newToken - The new access token
 */
const processQueue = (error, newToken = null) => {
    failedRequestsQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(newToken);
        }
    });

    failedRequestsQueue = []; // Clear the queue
};

axiosInstance.interceptors.response.use(
    // If the response is successful (status 200-299), just return it
    (response) => response,

    // If the response has an error, handle it here
    async (error) => {
        const originalRequest = error.config;

        /**
         * SCENARIO: Access token expired (401 Unauthorized)
         * -----------------------------------------------------
         * 1. Check if error is 401 and we haven't already tried to refresh
         * 2. Attempt to refresh the access token using refresh token
         * 3. Retry the original request with the new token
         */
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark this request as "attempted to refresh"

            if (isRefreshing) {
                /**
                 * SCENARIO: Another request is already refreshing the token
                 * ----------------------------------------------------------
                 * Instead of making multiple refresh requests at the same time,
                 * queue this request and wait for the token to be refreshed
                 */
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({ resolve, reject });
                })
                    .then((newToken) => {
                        // Token has been refreshed! Update this request's header and retry
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            // Start the refresh process
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refresh");

            if (!refreshToken) {
                // No refresh token available - log the user out
                console.error("No refresh token available. Logging out...");
                isRefreshing = false;
                processQueue(error, null);

                // Clear tokens and redirect to login
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.removeItem("user");
                window.location.href = "/login";

                return Promise.reject(error);
            }

            try {
                /**
                 * CALL THE REFRESH TOKEN ENDPOINT
                 * --------------------------------
                 * Send the refresh token to get a new access token
                 */
                console.log("🔄 Access token expired. Refreshing token...");

                const response = await axios.post(
                    "http://127.0.0.1:8000/api/auth/refresh-token",
                    {}, // Empty body
                    {
                        headers: {
                            refresh: refreshToken, // Send refresh token in header
                        },
                    }
                );

                // Extract the new access token from the response
                const newAccessToken = response.data.access;

                console.log("✅ Token refreshed successfully!");

                // Update localStorage with the new access token
                localStorage.setItem("access", newAccessToken);

                // Update the failed request's Authorization header
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Process all queued requests with the new token
                processQueue(null, newAccessToken);

                isRefreshing = false;

                // Retry the original request with the new token
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                /**
                 * SCENARIO: Refresh token is also expired/invalid
                 * ------------------------------------------------
                 * Log the user out and redirect to login page
                 */
                console.error("❌ Token refresh failed. Logging out...", refreshError);

                processQueue(refreshError, null);
                isRefreshing = false;

                // Clear all authentication data
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.removeItem("user");

                // Redirect to login page
                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        // For all other errors (not 401), just reject them normally
        return Promise.reject(error);
    }
);

// Export the configured axios instance
export default axiosInstance;

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: true, // Crucial for cookies
});

// Interceptor to handle 401 errors (token expiration)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. If the error is not 401, or we've already retried this request once, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 2. If the failed request WAS the refresh call itself, don't try to refresh again!
    if (originalRequest.url?.includes("/auth/refresh")) {
      // Clear local state or redirect to login if refresh fails
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // 3. Attempt to refresh the session
      await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      
      // 4. If successful, retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      // 5. If refresh fails (e.g., no refresh token or expired), redirect to login
      if (typeof window !== "undefined") {
        // Only redirect if we're not already on the login/register page
        const path = window.location.pathname;
        if (path !== "/login" && path !== "/register") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(refreshError);
    }
  }
);

export default api;

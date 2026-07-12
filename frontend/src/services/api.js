import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000
});

// Request interceptor to attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Extracts a clean, user-facing error message from a failed API call.
 * Prefers the backend's own message, since every controller in this
 * app returns { success: false, message: "..." } with a message
 * already written to be shown directly to the admin.
 */
export function getApiErrorMessage(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

/**
 * Normalizes MongoDB responses by mapping '_id' to 'id'.
 * Recursively normalizes arrays and nested objects.
 * Also extracts inner 'data' if the response is wrapped in the
 * standard API envelope ({ success, message, data }).
 */
export function normalize(data) {
  if (data === null || data === undefined) return data;

  if (
    typeof data === "object" &&
    !Array.isArray(data) &&
    "success" in data &&
    "data" in data
  ) {
    return normalize(data.data);
  }

  if (Array.isArray(data)) {
    return data.map(normalize);
  }

  if (typeof data === "object") {
    const normalized = { ...data };
    if ("_id" in normalized) {
      normalized.id = normalized._id;
    }
    for (const key in normalized) {
      if (Object.prototype.hasOwnProperty.call(normalized, key)) {
        normalized[key] = normalize(normalized[key]);
      }
    }
    return normalized;
  }

  return data;
}
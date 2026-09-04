import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5001" : ""),
  timeout: 15000,
});

// Attach JWT to every request if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fg_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

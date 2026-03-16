import axios from "axios";

console.log("ENV:", import.meta.env.VITE_BACKEND_API_ENDPOINT);
console.log("DEV:", import.meta.env.DEV);
console.log(
  "baseURL:",
  import.meta.env.DEV ? "/api" : import.meta.env.VITE_BACKEND_API_ENDPOINT,
);

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? `/api`
    : import.meta.env.VITE_BACKEND_API_ENDPOINT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const userId = localStorage.getItem("user_id");
  const orgId = localStorage.getItem("org_id");
  if (userId) config.headers["X-User-Id"] = userId;
  if (orgId) config.headers["X-Org-Id"] = orgId;
  return config;
});

export default api;

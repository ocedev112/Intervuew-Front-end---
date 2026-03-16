import axios from "axios";

const api = axios.create({
  baseURL: `/api`,
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

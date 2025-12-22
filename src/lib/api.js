import axios from "axios";

const RAW_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
const BASE_URL = RAW_BASE_URL.replace(/\/+$/g, "");

export const api = axios.create({
  baseURL: BASE_URL || undefined,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("auth");
      if (raw) {
        const { tokens } = JSON.parse(raw);
        const token = tokens?.accessToken;
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (_) {}
  }
  return config;
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const action = await store.dispatch(refreshUserToken());
        const newToken = action?.payload?.accessToken;

        if (!newToken) throw new Error("No new token received");

        localStorage.setItem(
          "auth",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("auth") || "{}"),
            tokens: {
              ...(JSON.parse(localStorage.getItem("auth") || "{}").tokens ||
                {}),
              accessToken: newToken,
            },
          })
        );

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth");
          window.location.href = "/auth";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

import axios, { AxiosError, AxiosRequestConfig, CreateAxiosDefaults } from "axios";
import { normalizeError } from "../utils/errors";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

type AuthToken = { accessToken: string }

type QueueItem = {
  resolve: (token: string) => void,
  reject: (err: any) => void,
}

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
})

let isRefreshing = false;
let failedQueue: QueueItem[] = [];
const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh"
]

const proccessQueue = (err: any, token: string | null) => {
  failedQueue.forEach((item) => {
    if (err) {
      item.reject(err)
    } else {
      item.resolve(token!)
    }
  })

  failedQueue = []
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token.trim()}`
    config.withCredentials = true
  }

  return config
}, (err) => {
  return Promise.reject(normalizeError(err))
})

api.interceptors.response.use((response) => {
  return response;
}, async (err: AxiosError & { config: CustomAxiosRequestConfig }) => {
  const originalRequest = err.config as CustomAxiosRequestConfig

  if (err.response?.status !== 401 || !AUTH_ENDPOINTS.some(p => originalRequest.url?.includes(p)) || originalRequest._retry) {
    return Promise.reject(normalizeError(err));
  }

  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
      .then((token) => {
        originalRequest.headers!.Authorization = `Bearer ${token}`
        return api(originalRequest);
      })
      .catch((err) => {
        return Promise.reject(normalizeError(err));
      })
  }

  isRefreshing = true;
  originalRequest._retry = true;

  try {
    const response = await api.post<AuthToken>("/auth/refresh", null, {
      withCredentials: true,
      _retry: true
    } as CustomAxiosRequestConfig)
    const { accessToken } = response.data;

    localStorage.setItem("access_token", accessToken)

    originalRequest.headers!.Authorization = `Bearer ${accessToken}`

    proccessQueue(null, accessToken)
  } catch (err) {
    localStorage.removeItem("access_token")
    proccessQueue(err, null)
    return Promise.reject(normalizeError(err));
  } finally {
    isRefreshing = false
  }
})

export default api;
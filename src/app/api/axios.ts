import axios from "axios";

const api = axios.create({
  baseURL: "localhost:8080",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Beare ${token.trim()}`
    config.withCredentials = true
  }
  return config
}, (err) => {
  return Promise.reject(err)
})


export default api;
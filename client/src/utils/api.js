import axios from 'axios'

// One central axios instance for the whole app
// If the backend URL ever changes, you change it here only
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Interceptor — runs before EVERY request automatically
// Attaches the JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
import axios from 'axios'

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
})

// Request interceptor for adding JWT token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
    (response) => {
        // Check if the response includes a new JWT token in the 'Authorization' header
        const newToken = response.headers['authorization']
        if (newToken) {
            const token = newToken.split(' ')[1] // Extract the token from 'Bearer {token}'
            localStorage.setItem('token', token) // Update token in localStorage
        }
        return response
    },
    async (error) => {
        const originalRequest = error.config
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true
            // Here you can try to refresh the token (if you have a refresh token flow)
            // For example, send a request to the refresh token endpoint
        }
        return Promise.reject(error)
    }
)

export default axiosInstance

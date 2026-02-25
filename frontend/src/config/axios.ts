import axios from 'axios'
import { config } from 'zod'

//localhost: 3000/api/route
const apiFrontend = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

apiFrontend.interceptors.request.use(
    async (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
apiFrontend.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error)
    }
)

export default apiFrontend
// src/api/axios.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Cambiá esto si tu backend usa otro puerto
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token JWT automáticamente si existe
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token'); // O la forma en que guardes tu token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
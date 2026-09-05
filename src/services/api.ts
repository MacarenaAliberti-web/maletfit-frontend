// services/api.ts
import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Si el 401 viene de verificar el usuario actual (/users/me), es normal si no estamos logueados. 
            // No debemos forzar una recarga en bucle.
            const isCheckingAuth = error.config?.url?.includes('/users/me');

            if (!isCheckingAuth && typeof window !== 'undefined') {
                // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                window.location.assign('/login');
            }
        }
        return Promise.reject(error);
    }
);
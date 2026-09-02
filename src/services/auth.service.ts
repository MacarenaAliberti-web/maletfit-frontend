// services/auth.service.ts
import { api } from './api';
import { LoginFormValues } from '@/lib/validations/auth';
import type { RegisterFormValues } from '@/lib/validations/auth';

export const authService = {
    async login(credentials: LoginFormValues) {
        const { data } = await api.post('/auth/login', credentials);
        return data; // Devuelve { user: { id, email, fullName, role } }
    },

    async register(values: RegisterFormValues) {
        const { data } = await api.post('/auth/register', values);
        return data; // Devuelve { user: { id, email, fullName, role } }
    },

    async logout() {
        await api.post('/auth/logout');
    },

    async getCurrentUser() {
        const { data } = await api.get('/users/me'); // Trae el usuario autenticado según la cookie HttpOnly
        return data;
    },
};
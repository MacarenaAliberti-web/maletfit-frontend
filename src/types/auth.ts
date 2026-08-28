// src/types/auth.ts
export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
}

export interface LoginResponse {
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}
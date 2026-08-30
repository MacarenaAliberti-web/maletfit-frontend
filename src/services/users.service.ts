// src/services/users.service.ts
import { api } from "./api";

export type UserRole = "ADMIN" | "INSTRUCTOR" | "STUDENT";

export interface StudentSummary {
    id: string;
    fullName: string;
    email: string;
}

export interface UserSummary {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    createdAt: string;
}

export const usersService = {
    async getAllStudents(): Promise<StudentSummary[]> {
        const { data } = await api.get<StudentSummary[]>("/users/students");
        return data;
    },

    async getAll(): Promise<UserSummary[]> {
        const { data } = await api.get<UserSummary[]>("/users");
        return data;
    },

    async updateRole(userId: string, role: UserRole): Promise<UserSummary> {
        const { data } = await api.patch<UserSummary>(`/users/${userId}/role`, { role });
        return data;
    },
};
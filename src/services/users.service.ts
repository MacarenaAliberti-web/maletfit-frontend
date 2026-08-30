// src/services/users.service.ts
import { api } from "./api";

export interface StudentSummary {
    id: string;
    fullName: string;
    email: string;
}

export const usersService = {
    async getAllStudents(): Promise<StudentSummary[]> {
        const { data } = await api.get<StudentSummary[]>("/users/students");
        return data;
    },
};
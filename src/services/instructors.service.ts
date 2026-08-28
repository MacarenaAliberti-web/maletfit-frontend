// src/services/instructors.service.ts
import { api } from "./api";
import type { InstructorWithUser } from "@/types/instructor";

export const instructorsService = {
    async getAll(): Promise<InstructorWithUser[]> {
        const { data } = await api.get<InstructorWithUser[]>("/instructors");
        return data;
    },

    async getMyProfile(): Promise<InstructorWithUser> {
        const { data } = await api.get<InstructorWithUser>("/instructors/me");
        return data;
    },
};
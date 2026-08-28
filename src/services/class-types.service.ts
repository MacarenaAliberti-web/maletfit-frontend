// src/services/class-types.service.ts
import { api } from "./api";
import type { ClassType } from "@/types/class-type";

export interface CreateClassTypeInput {
    name: string;
    description?: string;
    durationMin: number;
}

export const classTypesService = {
    async getAll(): Promise<ClassType[]> {
        const { data } = await api.get<ClassType[]>("/class-types");
        return data;
    },

    async create(input: CreateClassTypeInput): Promise<ClassType> {
        const { data } = await api.post<ClassType>("/class-types", input);
        return data;
    },
};
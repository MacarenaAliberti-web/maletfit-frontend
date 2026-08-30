// src/services/routines.service.ts
import { api } from "./api";
import type { Routine, RoutineWithStudent } from "@/types/routine";

export interface CreateExerciseInput {
    name: string;
    sets: number;
    reps: number;
    weightKg?: number;
}

export interface CreateRoutineInput {
    userId: string;
    title: string;
    notes?: string;
    exercises: CreateExerciseInput[];
}

export type UpdateRoutineInput = Partial<CreateRoutineInput>;

export const routinesService = {
    async getMyRoutines(): Promise<Routine[]> {
        const { data } = await api.get<Routine[]>("/routines/my-routines");
        return data;
    },

    async getAll(): Promise<RoutineWithStudent[]> {
        const { data } = await api.get<RoutineWithStudent[]>("/routines");
        return data;
    },

    async create(input: CreateRoutineInput): Promise<Routine> {
        const { data } = await api.post<Routine>("/routines", input);
        return data;
    },

    async update(routineId: string, input: UpdateRoutineInput): Promise<Routine> {
        const { data } = await api.patch<Routine>(`/routines/${routineId}`, input);
        return data;
    },
};
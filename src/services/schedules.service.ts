// src/services/schedules.service.ts
import { api } from "./api";
import type { Schedule } from "@/types/schedule";
import type { ScheduleRoster } from "@/types/roster";

export interface CreateScheduleInput {
    startTime: string;
    endTime: string;
    capacity: number;
    classTypeId: string;
    instructorId: string;
}

export const schedulesService = {
    async getAll(): Promise<Schedule[]> {
        const { data } = await api.get<Schedule[]>("/schedules");
        return data;
    },

    async getMySchedules(): Promise<Schedule[]> {
        const { data } = await api.get<Schedule[]>("/schedules/my-schedules");
        return data;
    },

    async getRoster(scheduleId: string): Promise<ScheduleRoster> {
        const { data } = await api.get<ScheduleRoster>(
            `/schedules/${scheduleId}/roster`,
        );
        return data;
    },

    async create(input: CreateScheduleInput): Promise<Schedule> {
        const { data } = await api.post<Schedule>("/schedules", input);
        return data;
    },
};
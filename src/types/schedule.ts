// src/types/schedule.ts
import type { ClassType } from "./class-type";

export interface Instructor {
    id: string;
    bio: string | null;
    specialty: string | null;
    user: {
        fullName: string;
        email: string;
    };
}

export interface Schedule {
    id: string;
    startTime: string;
    endTime: string;
    capacity: number;
    status: string;
    classType: ClassType;
    instructor: Instructor;
    _count: {
        bookings: number;
    };
}

export interface ScheduleAvailability {
    scheduleId: string;
    capacity: number;
    occupiedSeats: number;
    availableSeats: number;
    isFull: boolean;
}

export type { ClassType };
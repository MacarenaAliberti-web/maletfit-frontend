// src/types/schedule.ts

export interface ClassType {
    id: string;
    name: string;
    description: string | null;
    durationMin: number;
}

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
    startTime: string; // ISO string, tal como charlamos — no es un objeto Date
    endTime: string;
    capacity: number;
    status: string;
    classType: ClassType;
    instructor: Instructor;
    _count: {
        bookings: number; // cantidad de reservas CONFIRMED — así lo devuelve tu findAll()
    };
}

export interface ScheduleAvailability {
    scheduleId: string;
    capacity: number;
    occupiedSeats: number;
    availableSeats: number;
    isFull: boolean;
}
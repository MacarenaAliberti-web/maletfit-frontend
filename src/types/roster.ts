// src/types/roster.ts
import type { BookingStatus } from "./booking";

export interface RosterEntry {
    id: string;
    status: BookingStatus;
    userId: string;
    scheduleId: string;
    user: {
        id: string;
        fullName: string;
        email: string;
    };
}

export interface ScheduleRoster {
    scheduleId: string;
    confirmed: RosterEntry[];
    waitlist: RosterEntry[];
}
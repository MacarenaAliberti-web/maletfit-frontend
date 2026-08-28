// src/types/booking.ts
import type { Schedule } from "./schedule";

export type BookingStatus =
    | "CONFIRMED"
    | "CANCELLED"
    | "WAITLIST"
    | "ATTENDED"
    | "NO_SHOW";

export interface Booking {
    id: string;
    status: BookingStatus;
    userId: string;
    scheduleId: string;
    schedule: Schedule; // findMyBookings() siempre incluye el schedule completo
}
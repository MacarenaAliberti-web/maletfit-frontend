// src/services/bookings.service.ts
import { api } from "./api";
import type { Booking } from "@/types/booking";

export const bookingsService = {
    async create(scheduleId: string): Promise<Booking> {
        const { data } = await api.post<Booking>("/bookings", { scheduleId });
        return data;
    },

    async getMyBookings(): Promise<Booking[]> {
        const { data } = await api.get<Booking[]>("/bookings/my-bookings");
        return data;
    },

    async cancel(bookingId: string): Promise<Booking> {
        const { data } = await api.patch<Booking>(`/bookings/${bookingId}/cancel`);
        return data;
    },

    async markAttendance(
        bookingId: string,
        status: "ATTENDED" | "NO_SHOW",
    ): Promise<Booking> {
        const { data } = await api.patch<Booking>(
            `/bookings/${bookingId}/attendance`,
            { status },
        );
        return data;
    },
};
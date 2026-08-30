// src/components/dashboard/student/my-bookings-list.tsx
"use client";

import {
  CalendarDays,
  Clock,
  User,
  CalendarX2,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/types/booking";

interface MyBookingsListProps {
  bookings: Booking[];
  cancelingBookingId: string | null;
  onCancel: (bookingId: string) => void;
}

const statusLabels: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "Confirmado", className: "bg-primary/15 text-primary" },
  WAITLIST: {
    label: "En lista de espera",
    className: "bg-amber-500/15 text-amber-500",
  },
  ATTENDED: {
    label: "Asististe",
    className: "bg-emerald-500/15 text-emerald-500",
  },
  NO_SHOW: {
    label: "No asististe",
    className: "bg-destructive/15 text-destructive",
  },
};

export function MyBookingsList({
  bookings,
  cancelingBookingId,
  onCancel,
}: MyBookingsListProps) {
  // Solo mostramos reservas activas o resueltas — no las ya canceladas
  const activeBookings = bookings.filter((b) => b.status !== "CANCELLED");

  return (
    <section aria-labelledby="reservas-heading">
      <div className="mb-5">
        <h2
          id="reservas-heading"
          className="text-xl font-semibold tracking-tight"
        >
          Mis reservas
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeBookings.length > 0
            ? `Tenés ${activeBookings.length} ${
                activeBookings.length === 1 ? "turno activo" : "turnos activos"
              }.`
            : "Todavía no reservaste ninguna clase."}
        </p>
      </div>

      {activeBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CalendarX2 className="size-6" />
          </div>
          <p className="text-sm font-medium">No tenés turnos reservados</p>
          <p className="max-w-xs text-sm text-muted-foreground text-balance">
            Reservá una clase desde la sección de clases disponibles para verla
            acá.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {activeBookings.map((booking) => {
            const status = statusLabels[booking.status];
            const canCancel =
              booking.status === "CONFIRMED" || booking.status === "WAITLIST";

            return (
              <li
                key={booking.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold tracking-tight">
                      {booking.schedule.classType.name}
                    </h3>
                    {status && (
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="size-4" />
                      {booking.schedule.instructor.user.fullName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-4" />
                      {new Date(
                        booking.schedule.startTime,
                      ).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-4" />
                      {new Date(booking.schedule.startTime).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                </div>

                {canCancel && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="shrink-0 self-start sm:self-auto"
                    onClick={() => onCancel(booking.id)}
                    disabled={cancelingBookingId === booking.id}
                  >
                    {cancelingBookingId === booking.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <X className="size-4" />
                    )}
                    Cancelar reserva
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

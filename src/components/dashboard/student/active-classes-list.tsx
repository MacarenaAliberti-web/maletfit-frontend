// src/components/dashboard/student/active-classes-list.tsx
"use client";

import { ScheduleCard } from "./schedule-card";
import type { Schedule } from "@/types/schedule";
import type { Booking } from "@/types/booking";

interface ActiveClassesListProps {
  schedules: Schedule[];
  bookings: Booking[]; // reservas activas del alumno, para saber su estado en cada schedule
  reservingScheduleId: string | null; // qué card tiene una request en curso, si hay alguna
  onReserve: (scheduleId: string) => void;
}

export function ActiveClassesList({
  schedules,
  bookings,
  reservingScheduleId,
  onReserve,
}: ActiveClassesListProps) {
  // Mapa rápido: scheduleId -> status de la reserva del alumno en ese turno
  const statusByScheduleId = new Map(
    bookings
      .filter((b) => b.status === "CONFIRMED" || b.status === "WAITLIST")
      .map((b) => [b.scheduleId, b.status]),
  );

  return (
    <section aria-labelledby="clases-heading">
      <div className="mb-5">
        <h2
          id="clases-heading"
          className="text-xl font-semibold tracking-tight"
        >
          Clases disponibles
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Elegí tu próxima sesión y asegurá tu lugar.
        </p>
      </div>

      {schedules.length === 0 ? (
        <p className="text-muted-foreground text-center py-6">
          No hay clases disponibles por ahora.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              bookingStatus={statusByScheduleId.get(schedule.id) ?? null}
              isReserving={reservingScheduleId === schedule.id}
              onReserve={onReserve}
            />
          ))}
        </div>
      )}
    </section>
  );
}

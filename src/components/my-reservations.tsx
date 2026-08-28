"use client";

import { CalendarDays, Clock, User, CalendarX2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryStyles, type GymClass } from "@/lib/gym-data";

type MyReservationsProps = {
  reservations: GymClass[];
  onCancel: (id: string) => void;
};

export function MyReservations({
  reservations,
  onCancel,
}: MyReservationsProps) {
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
          {reservations.length > 0
            ? `Tenés ${reservations.length} ${
                reservations.length === 1 ? "turno activo" : "turnos activos"
              }.`
            : "Todavía no reservaste ninguna clase."}
        </p>
      </div>

      {reservations.length === 0 ? (
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
          {reservations.map((r) => {
            const category = categoryStyles[r.category];
            return (
              <li
                key={r.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold tracking-tight">{r.name}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${category.className}`}
                    >
                      {category.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="size-4" />
                      {r.instructor}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-4" />
                      {r.day}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-4" />
                      {r.time}
                    </span>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="shrink-0 self-start sm:self-auto"
                  onClick={() => onCancel(r.id)}
                >
                  <X className="size-4" />
                  Cancelar reserva
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

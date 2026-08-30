// src/components/dashboard/student/schedule-card.tsx
"use client";

import {
  CalendarDays,
  Clock,
  User,
  Users,
  Check,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Schedule } from "@/types/schedule";
import type { BookingStatus } from "@/types/booking";

interface ScheduleCardProps {
  schedule: Schedule;
  bookingStatus: BookingStatus | null; // null = el alumno no tiene reserva en este turno
  isReserving: boolean;
  onReserve: (scheduleId: string) => void;
}

export function ScheduleCard({
  schedule,
  bookingStatus,
  isReserving,
  onReserve,
}: ScheduleCardProps) {
  const booked = schedule._count.bookings;
  const capacity = schedule.capacity;
  const isFull = booked >= capacity && bookingStatus === null;
  const pct = Math.min(100, Math.round((booked / capacity) * 100));

  const barColor =
    pct >= 100 ? "bg-destructive" : pct >= 75 ? "bg-chart-3" : "bg-primary";

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          {schedule.classType.name}
        </span>

        {bookingStatus === "CONFIRMED" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
            <Check className="size-3" />
            Reservado
          </span>
        )}
        {bookingStatus === "WAITLIST" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-500">
            En lista de espera
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-semibold tracking-tight text-balance">
        {schedule.classType.name}
      </h3>

      <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="size-4 shrink-0" />
          <span>{schedule.instructor.user.fullName}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0" />
          <span>{new Date(schedule.startTime).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-4 shrink-0" />
          <span>
            {new Date(schedule.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="size-3.5" />
            Cupos
          </span>
          <span className="font-medium text-foreground">
            {booked} / {capacity} ocupados
          </span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${booked} de ${capacity} cupos ocupados`}
        >
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-5">
        {bookingStatus === "CONFIRMED" ? (
          <Button variant="secondary" size="lg" className="w-full" disabled>
            <Check className="size-4" />
            Turno reservado
          </Button>
        ) : bookingStatus === "WAITLIST" ? (
          <Button variant="secondary" size="lg" className="w-full" disabled>
            En lista de espera
          </Button>
        ) : isFull ? (
          <Button
            size="lg"
            className="w-full"
            onClick={() => onReserve(schedule.id)}
            disabled={isReserving}
          >
            {isReserving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            {isReserving ? "Procesando..." : "Anotarme a lista de espera"}
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full"
            onClick={() => onReserve(schedule.id)}
            disabled={isReserving}
          >
            {isReserving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            {isReserving ? "Reservando..." : "Reservar Turno"}
          </Button>
        )}
      </div>
    </article>
  );
}

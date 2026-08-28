"use client";

import { CalendarDays, Clock, User, Users, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryStyles, type GymClass } from "@/lib/gym-data";

type ClassCardProps = {
  gymClass: GymClass;
  reserved: boolean;
  onReserve: (id: string) => void;
};

export function ClassCard({ gymClass, reserved, onReserve }: ClassCardProps) {
  const { booked, capacity } = gymClass;
  const isFull = booked >= capacity && !reserved;
  const pct = Math.min(100, Math.round((booked / capacity) * 100));
  const category = categoryStyles[gymClass.category];

  const barColor =
    pct >= 100 ? "bg-destructive" : pct >= 75 ? "bg-chart-3" : "bg-primary";

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${category.className}`}
        >
          {category.label}
        </span>
        {reserved && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-primary">
            <Check className="size-3" />
            Reservado
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-semibold tracking-tight text-balance">
        {gymClass.name}
      </h3>

      <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <User className="size-4 shrink-0" />
          <span>{gymClass.instructor}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0" />
          <span>{gymClass.day}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-4 shrink-0" />
          <span>{gymClass.time}</span>
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
        {reserved ? (
          <Button variant="secondary" size="lg" className="w-full" disabled>
            <Check className="size-4" />
            Turno reservado
          </Button>
        ) : isFull ? (
          <Button variant="secondary" size="lg" className="w-full" disabled>
            Completo · Sin cupo
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full"
            onClick={() => onReserve(gymClass.id)}
          >
            <Plus className="size-4" />
            Reservar Turno
          </Button>
        )}
      </div>
    </article>
  );
}

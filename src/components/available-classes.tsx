"use client";

import { ClassCard } from "@/components/class-card";
import type { GymClass } from "@/lib/gym-data";

type AvailableClassesProps = {
  classes: GymClass[];
  reservedIds: string[];
  onReserve: (id: string) => void;
};

export function AvailableClasses({
  classes,
  reservedIds,
  onReserve,
}: AvailableClassesProps) {
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((gymClass) => (
          <ClassCard
            key={gymClass.id}
            gymClass={gymClass}
            reserved={reservedIds.includes(gymClass.id)}
            onReserve={onReserve}
          />
        ))}
      </div>
    </section>
  );
}

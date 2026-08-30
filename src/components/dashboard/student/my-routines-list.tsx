// src/components/dashboard/student/my-routines-list.tsx
"use client";

import { Dumbbell, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Routine } from "@/types/routine";

interface MyRoutinesListProps {
  routines: Routine[];
}

export function MyRoutinesList({ routines }: MyRoutinesListProps) {
  return (
    <section aria-labelledby="rutinas-heading">
      <div className="mb-5">
        <h2
          id="rutinas-heading"
          className="text-xl font-semibold tracking-tight"
        >
          Mis rutinas
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {routines.length > 0
            ? `Tenés ${routines.length} ${routines.length === 1 ? "rutina asignada" : "rutinas asignadas"}.`
            : "Todavía no tenés rutinas asignadas."}
        </p>
      </div>

      {routines.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ClipboardList className="size-6" />
          </div>
          <p className="text-sm font-medium">No tenés rutinas asignadas</p>
          <p className="max-w-xs text-sm text-muted-foreground text-balance">
            Tu instructor te va a asignar una rutina de entrenamiento
            próximamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {routines.map((routine) => (
            <Card key={routine.id} className="border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Dumbbell className="size-5 text-emerald-500" />
                  {routine.title}
                </CardTitle>
                {routine.notes && (
                  <p className="text-sm text-muted-foreground">
                    {routine.notes}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {routine.exercises.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Esta rutina todavía no tiene ejercicios cargados.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {[...routine.exercises]
                      .sort((a, b) => a.orderIndex - b.orderIndex)
                      .map((exercise) => (
                        <li
                          key={exercise.id}
                          className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm"
                        >
                          <span className="font-medium">{exercise.name}</span>
                          <span className="text-muted-foreground">
                            {exercise.sets} × {exercise.reps}
                            {exercise.weightKg != null &&
                              ` · ${exercise.weightKg} kg`}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

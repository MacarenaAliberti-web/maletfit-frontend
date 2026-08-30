// src/components/dashboard/instructor/assigned-routines-list.tsx
"use client";

import { Dumbbell, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RoutineWithStudent } from "@/types/routine";

interface AssignedRoutinesListProps {
  routines: RoutineWithStudent[];
  onEdit: (routine: RoutineWithStudent) => void;
}

export function AssignedRoutinesList({
  routines,
  onEdit,
}: AssignedRoutinesListProps) {
  if (routines.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-6">
        Todavía no asignaste ninguna rutina.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {routines.map((routine) => (
        <Card key={routine.id} className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <Dumbbell className="size-5 text-emerald-500" />
                {routine.title}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(routine)}
              >
                Editar
              </Button>
            </CardTitle>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="size-4" />
              {routine.user.fullName}
            </p>
            {routine.notes && (
              <p className="text-sm text-muted-foreground">{routine.notes}</p>
            )}
          </CardHeader>
          <CardContent>
            {routine.exercises.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sin ejercicios cargados.
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
  );
}

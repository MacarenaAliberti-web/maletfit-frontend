// src/components/dashboard/instructor/edit-routine-form.tsx
"use client";

import { useState } from "react";
import { Save, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routinesService } from "@/services/routines.service";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import type { RoutineWithStudent } from "@/types/routine";

interface ExerciseFormValue {
  name: string;
  sets: number;
  reps: number;
  weightKg: number | undefined;
}

interface EditRoutineFormProps {
  routine: RoutineWithStudent;
  onSaved: () => void;
  onCancel: () => void;
}

export function EditRoutineForm({
  routine,
  onSaved,
  onCancel,
}: EditRoutineFormProps) {
  const [title, setTitle] = useState(routine.title);
  const [notes, setNotes] = useState(routine.notes ?? "");
  const [exercises, setExercises] = useState<ExerciseFormValue[]>(
    [...routine.exercises]
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((ex) => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        weightKg: ex.weightKg ?? undefined,
      })),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function updateExercise(
    index: number,
    field: keyof ExerciseFormValue,
    value: string | number | undefined,
  ) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)),
    );
  }

  function addExercise() {
    setExercises((prev) => [
      ...prev,
      { name: "", sets: 3, reps: 10, weightKg: undefined },
    ]);
  }

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (exercises.length === 0) {
      setFormError("Debe haber al menos un ejercicio.");
      return;
    }

    setIsSubmitting(true);
    try {
      await routinesService.update(routine.id, {
        title,
        notes: notes || undefined,
        exercises,
      });
      onSaved();
    } catch (error: unknown) {
      setFormError(getApiErrorMessage(error, "No se pudo guardar la rutina."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className=" bg-card border-primary/40">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Editando rutina de {routine.user.fullName}</span>
          <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
            <X className="size-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título de la rutina</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notas (Opcional)</label>
            <Input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Ejercicios</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExercise}
              >
                Agregar ejercicio
              </Button>
            </div>

            {exercises.map((exercise, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-end rounded-lg border border-border p-3"
              >
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    Nombre
                  </label>
                  <Input
                    type="text"
                    value={exercise.name}
                    onChange={(e) =>
                      updateExercise(index, "name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    Series
                  </label>
                  <Input
                    type="number"
                    min={1}
                    value={exercise.sets}
                    onChange={(e) =>
                      updateExercise(index, "sets", Number(e.target.value))
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Reps</label>
                  <Input
                    type="number"
                    min={1}
                    value={exercise.reps}
                    onChange={(e) =>
                      updateExercise(index, "reps", Number(e.target.value))
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    Peso (kg)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    step="0.5"
                    placeholder="Opcional"
                    value={exercise.weightKg ?? ""}
                    onChange={(e) =>
                      updateExercise(
                        index,
                        "weightKg",
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                      )
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExercise(index)}
                  disabled={exercises.length === 1}
                  title={
                    exercises.length === 1
                      ? "Debe haber al menos un ejercicio"
                      : "Quitar ejercicio"
                  }
                >
                  <Trash2 className="size-4 text-red-400" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1 bg-emerald-500 text-black hover:bg-emerald-600 font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>

          {formError && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
              {formError}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

// src/components/dashboard/instructor/create-routine-form.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  routinesService,
  type CreateExerciseInput,
} from "@/services/routines.service";
import { usersService, type StudentSummary } from "@/services/users.service";
import { getApiErrorMessage } from "@/lib/get-api-error-message";

interface CreateRoutineFormProps {
  onCreated: () => void;
}

const emptyExercise: CreateExerciseInput = { name: "", sets: 3, reps: 10 };

export function CreateRoutineForm({ onCreated }: CreateRoutineFormProps) {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loadingSetup, setLoadingSetup] = useState(true);
  const [setupError, setSetupError] = useState<string | null>(null);

  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<CreateExerciseInput[]>([
    { ...emptyExercise },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadStudents() {
      try {
        const data = await usersService.getAllStudents();
        if (!ignore) {
          setStudents(data);
          if (data.length > 0) {
            setUserId(data[0].id);
          }
        }
      } catch {
        if (!ignore) {
          setSetupError("No se pudo cargar la lista de alumnos.");
        }
      } finally {
        if (!ignore) {
          setLoadingSetup(false);
        }
      }
    }

    loadStudents();

    return () => {
      ignore = true;
    };
  }, []);

  function updateExercise(
    index: number,
    field: keyof CreateExerciseInput,
    value: string | number | undefined,
  ) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex)),
    );
  }

  function addExercise() {
    setExercises((prev) => [...prev, { ...emptyExercise }]);
  }

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (exercises.length === 0) {
      setFormError("Agregá al menos un ejercicio.");
      return;
    }

    setIsSubmitting(true);
    try {
      await routinesService.create({
        userId,
        title,
        notes: notes || undefined,
        exercises,
      });

      setTitle("");
      setNotes("");
      setExercises([{ ...emptyExercise }]);

      onCreated();
    } catch (error: unknown) {
      setFormError(getApiErrorMessage(error, "No se pudo crear la rutina."));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loadingSetup) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-6 text-center text-muted-foreground">
          Cargando formulario...
        </CardContent>
      </Card>
    );
  }

  if (setupError) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-6 text-center text-red-500">
          {setupError}
        </CardContent>
      </Card>
    );
  }

  if (students.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-6 text-center text-muted-foreground">
          No hay alumnos registrados todavía.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Asignar Nueva Rutina</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Alumno</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Título de la rutina</label>
              <Input
                type="text"
                placeholder="Ej: Rutina de fuerza - Semana 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notas (Opcional)</label>
            <Input
              type="text"
              placeholder="Ej: Enfocado en tren superior, 3 veces por semana"
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
                <Plus className="mr-1 size-4" />
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
                    placeholder="Ej: Press de banca"
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

          <Button
            type="submit"
            className="w-full bg-emerald-500 text-black hover:bg-emerald-600 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Plus className="mr-2 size-4" />
            )}
            {isSubmitting ? "Creando..." : "Asignar Rutina"}
          </Button>

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

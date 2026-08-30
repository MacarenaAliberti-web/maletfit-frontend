// src/components/dashboard/instructor/create-schedule-form.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { schedulesService } from "@/services/schedules.service";
import { classTypesService } from "@/services/class-types.service";
import { instructorsService } from "@/services/instructors.service";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import type { ClassType } from "@/types/class-type";

interface CreateScheduleFormProps {
  onCreated: () => void; // el padre decide qué hacer después (refrescar la lista)
}

export function CreateScheduleForm({ onCreated }: CreateScheduleFormProps) {
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [myInstructorId, setMyInstructorId] = useState<string | null>(null);
  const [loadingSetup, setLoadingSetup] = useState(true);
  const [setupError, setSetupError] = useState<string | null>(null);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState(5);
  const [classTypeId, setClassTypeId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Carga inicial: tipos de clase disponibles + mi propio Instructor.id
  useEffect(() => {
    let ignore = false;

    async function loadSetupData() {
      try {
        const [classTypesData, myProfile] = await Promise.all([
          classTypesService.getAll(),
          instructorsService.getMyProfile(),
        ]);
        if (!ignore) {
          setClassTypes(classTypesData);
          setMyInstructorId(myProfile.id);
          if (classTypesData.length > 0) {
            setClassTypeId(classTypesData[0].id);
          }
        }
      } catch {
        if (!ignore) {
          setSetupError(
            "No se pudo cargar la información necesaria para el formulario.",
          );
        }
      } finally {
        if (!ignore) {
          setLoadingSetup(false);
        }
      }
    }

    loadSetupData();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!myInstructorId) {
      setFormError("No se pudo determinar tu perfil de instructor.");
      return;
    }

    setIsSubmitting(true);
    try {
      await schedulesService.create({
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        capacity: Number(capacity),
        classTypeId,
        instructorId: myInstructorId, // se autoasigna, no elige de un combo
      });

      setStartTime("");
      setEndTime("");
      setCapacity(5);
      setClassTypeId(classTypes.length > 0 ? classTypes[0].id : "");

      onCreated();
    } catch (error: unknown) {
      setFormError(getApiErrorMessage(error, "No se pudo crear el turno."));
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

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Programar Nuevo Turno</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Clase</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={classTypeId}
                onChange={(e) => setClassTypeId(e.target.value)}
                required
              >
                <option value="">Seleccionar tipo de clase...</option>
                {classTypes.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Inicio</label>
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fin</label>
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cupo Máximo</label>
              <Input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                required
              />
            </div>

            <div className="md:col-span-3">
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
                {isSubmitting ? "Creando..." : "Crear Turno"}
              </Button>
            </div>
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

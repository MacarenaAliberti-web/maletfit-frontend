// src/components/dashboard/instructor-dashboard-view.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, Users, CalendarDays, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { schedulesService } from "@/services/schedules.service";
import { routinesService } from "@/services/routines.service";
import type { Schedule } from "@/types/schedule";
import type { RoutineWithStudent } from "@/types/routine";
import { ScheduleRoster } from "./shared/schedule-roster";
import { CreateScheduleForm } from "./instructor/create-schedule-form";
import { CreateRoutineForm } from "./shared/create-routine-form";
import { EditRoutineForm } from "./shared/edit-routine-form";
import { AssignedRoutinesList } from "./shared/assigned-routines-list";

type Tab = "turnos" | "rutinas";

export default function InstructorDashboardView() {
  const [activeTab, setActiveTab] = useState<Tab>("turnos");

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [routines, setRoutines] = useState<RoutineWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editingRoutine, setEditingRoutine] =
    useState<RoutineWithStudent | null>(null);
  const routineFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [schedulesData, routinesData] = await Promise.all([
          schedulesService.getMySchedules(),
          routinesService.getAll(),
        ]);
        if (!ignore) {
          setSchedules(schedulesData);
          setRoutines(routinesData);
        }
      } catch {
        if (!ignore) {
          setLoadError(
            "No se pudieron cargar los datos. Probá recargar la página.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  // Al entrar en modo edición, llevamos la vista hasta el formulario —
  // si el instructor tocó "Editar" en una card más abajo en el scroll,
  // de otra forma el formulario aparece fuera de la vista sin ninguna señal.
  useEffect(() => {
    if (editingRoutine) {
      routineFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [editingRoutine]);

  async function refreshSchedules() {
    const data = await schedulesService.getMySchedules();
    setSchedules(data);
  }

  async function refreshRoutines() {
    const data = await routinesService.getAll();
    setRoutines(data);
  }

  function handleEditRoutine(routine: RoutineWithStudent) {
    setEditingRoutine(routine);
  }

  function handleCancelEdit() {
    setEditingRoutine(null);
  }

  async function handleRoutineSaved() {
    setEditingRoutine(null);
    await refreshRoutines();
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Cargando tu panel...
      </div>
    );
  }

  if (loadError) {
    return <div className="p-8 text-center text-red-500">{loadError}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Panel del Instructor
          </h1>
          <p className="text-sm text-muted-foreground">
            Programá turnos, gestioná asistencia y administrá las rutinas de tus
            alumnos.
          </p>
        </div>

        <div className="flex bg-muted p-1 rounded-lg gap-1 border border-border">
          <button
            onClick={() => setActiveTab("turnos")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "turnos"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays className="size-4" /> Turnos
          </button>
          <button
            onClick={() => setActiveTab("rutinas")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "rutinas"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Dumbbell className="size-4" /> Rutinas
          </button>
        </div>
      </div>

      {activeTab === "turnos" && (
        <div className="space-y-4">
          <CreateScheduleForm onCreated={refreshSchedules} />

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Mis Turnos</h2>

            {schedules.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                Todavía no tenés turnos asignados.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules.map((schedule) => (
                  <Card key={schedule.id} className="border-border bg-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        {schedule.classType.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-emerald-500" />
                        <span>
                          Inicio:{" "}
                          {new Date(schedule.startTime).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-emerald-500" />
                        <span>
                          Fin: {new Date(schedule.endTime).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-emerald-500" />
                        <span>
                          {schedule._count.bookings} / {schedule.capacity}{" "}
                          anotados
                        </span>
                      </div>

                      <div className="pt-2">
                        <ScheduleRoster scheduleId={schedule.id} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "rutinas" && (
        <div className="space-y-4">
          <div ref={routineFormRef}>
            {editingRoutine ? (
              <EditRoutineForm
                key={editingRoutine.id}
                routine={editingRoutine}
                onSaved={handleRoutineSaved}
                onCancel={handleCancelEdit}
              />
            ) : (
              <CreateRoutineForm onCreated={refreshRoutines} />
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Rutinas Asignadas</h2>
            <AssignedRoutinesList
              routines={routines}
              onEdit={handleEditRoutine}
            />
          </div>
        </div>
      )}
    </div>
  );
}

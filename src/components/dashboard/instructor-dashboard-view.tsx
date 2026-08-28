// src/components/dashboard/instructor-dashboard-view.tsx
"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { schedulesService } from "@/services/schedules.service";
import type { Schedule } from "@/types/schedule";
import { ScheduleRoster } from "./instructor/schedule-roster";

export default function InstructorDashboardView() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadSchedules() {
      try {
        const data = await schedulesService.getMySchedules();
        if (!ignore) {
          setSchedules(data);
        }
      } catch {
        if (!ignore) {
          setLoadError("No se pudieron cargar tus turnos.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSchedules();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Cargando tus turnos...
      </div>
    );
  }

  if (loadError) {
    return <div className="p-8 text-center text-red-500">{loadError}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mis Turnos</h1>
        <p className="text-sm text-muted-foreground">
          Turnos que dictás — gestioná asistencia y consultá tus alumnos
          anotados.
        </p>
      </div>

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
                    Inicio: {new Date(schedule.startTime).toLocaleString()}
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
                    {schedule._count.bookings} / {schedule.capacity} anotados
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
  );
}

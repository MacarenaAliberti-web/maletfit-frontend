// src/components/dashboard/admin-classes-view.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Calendar, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

type GymClass = {
  id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  status: string;
  classTypeId: string;
  instructorId: string;
  classType?: {
    name: string;
  };
  instructor?: {
    user?: {
      fullName: string;
    };
  };
};

type User = {
  id: string;
  fullName: string;
  role: string;
};

type ClassType = {
  id: string;
  name: string;
};

export default function AdminClassesView() {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del formulario
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [classTypeId, setClassTypeId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const fetchInitialData = useCallback(async () => {
    try {
      const [schedulesRes, usersRes, classTypesRes] = await Promise.all([
        axios.get("http://localhost:3000/schedules", { withCredentials: true }),
        axios
          .get("http://localhost:3000/users", { withCredentials: true })
          .catch(() => ({ data: [] })),
        axios
          .get("http://localhost:3000/class-types", { withCredentials: true })
          .catch(() => ({ data: [] })),
      ]);

      setClasses(schedulesRes.data);
      setClassTypes(classTypesRes.data);

      const allUsers: User[] = usersRes.data;
      const filteredInstructors = allUsers.filter(
        (u) => u.role === "INSTRUCTOR" || u.role === "ADMIN",
      );
      setInstructors(filteredInstructors);

      // Si hay tipos de clase y no hay uno seleccionado, preseleccionamos el primero
      if (classTypesRes.data.length > 0 && !classTypeId) {
        setClassTypeId(classTypesRes.data[0].id);
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      setLoading(false);
    }
  }, [classTypeId]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await axios.post(
        "http://localhost:3000/schedules",
        {
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          capacity: Number(capacity),
          classTypeId,
          instructorId,
        },
        { withCredentials: true },
      );

      setStartTime("");
      setEndTime("");
      setCapacity(10);
      if (classTypes.length > 0) {
        setClassTypeId(classTypes[0].id);
      } else {
        setClassTypeId("");
      }
      setInstructorId("");

      fetchInitialData();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message;
        setFormError(
          Array.isArray(msg)
            ? msg.join(", ")
            : msg || "Error al crear la clase",
        );
      } else {
        setFormError("Ocurrió un error inesperado.");
      }
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Gestión de Clases y Horarios
        </h1>
      </div>

      {/* Formulario para Crear Clase */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Programar Nueva Clase</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateClass} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Clase</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                <label className="text-sm font-medium">
                  Profesor / Instructor
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={instructorId}
                  onChange={(e) => setInstructorId(e.target.value)}
                  required
                >
                  <option value="">Seleccionar profesor...</option>
                  {instructors.map((ins) => (
                    <option key={ins.id} value={ins.id}>
                      {ins.fullName || ins.id} ({ins.role})
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
                >
                  <Plus className="mr-2 size-4" /> Crear Clase
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

      {/* Listado de Clases Existentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-6">
            No hay clases programadas todavía. ¡Creá la primera arriba!
          </p>
        ) : (
          classes.map((c) => (
            <Card
              key={c.id}
              className="border-border bg-card flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex justify-between items-center">
                  <span>{c.classType?.name || "Clase Programada"}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-normal">
                    {c.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-emerald-500" />
                  <span>Inicio: {new Date(c.startTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-emerald-500" />
                  <span>Fin: {new Date(c.endTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-emerald-500" />
                  <span>Cupo: {c.capacity} alumnos</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

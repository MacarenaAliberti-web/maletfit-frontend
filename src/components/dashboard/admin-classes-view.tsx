// src/components/dashboard/admin-classes-view.tsx
"use client";

import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useEffect, useState } from "react";
import { Plus, Calendar, Clock, Users, Tag, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { schedulesService } from "@/services/schedules.service";
import { classTypesService } from "@/services/class-types.service";
import { instructorsService } from "@/services/instructors.service";
import type { Schedule } from "@/types/schedule";
import type { ClassType } from "@/types/class-type";
import type { InstructorWithUser } from "@/types/instructor";

export default function AdminClassesView() {
  const [activeTab, setActiveTab] = useState<"schedules" | "class-types">(
    "schedules",
  );

  const [classes, setClasses] = useState<Schedule[]>([]);
  const [instructors, setInstructors] = useState<InstructorWithUser[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del formulario de Clases (Schedules)
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [classTypeId, setClassTypeId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Estados del formulario de Tipos de Clase (Class Types)
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDesc, setNewTypeDesc] = useState("");
  const [newTypeDuration, setNewTypeDuration] = useState(60);
  const [typeFormError, setTypeFormError] = useState<string | null>(null);
  const [typeFormSuccess, setTypeFormSuccess] = useState<string | null>(null);

  // Carga inicial: usa el patrón "ignore" para evitar setState sobre un
  // componente ya desmontado (o pisar datos nuevos con una respuesta vieja
  // si el efecto llegara a re-ejecutarse antes de que termine el fetch).
  useEffect(() => {
    let ignore = false;

    async function loadInitialData() {
      try {
        const [schedulesData, instructorsData, classTypesData] =
          await Promise.all([
            schedulesService.getAll().catch(() => []),
            instructorsService.getAll().catch(() => []),
            classTypesService.getAll().catch(() => []),
          ]);

        if (ignore) return;

        setClasses(schedulesData);
        setInstructors(instructorsData);
        setClassTypes(classTypesData);
        setClassTypeId((prev) => prev || (classTypesData[0]?.id ?? ""));
      } catch (error) {
        if (!ignore) {
          console.error("Error al cargar los datos:", error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, []); // Solo corre una vez, al montar

  // Refresco manual después de crear una clase o un tipo de clase.
  // No usa el patrón "ignore" porque se dispara en respuesta a una acción
  // del usuario (no en un efecto), así que no corre el mismo riesgo de
  // condición de carrera por montaje/desmontaje.
  async function refreshData() {
    const [schedulesData, instructorsData, classTypesData] = await Promise.all([
      schedulesService.getAll().catch(() => []),
      instructorsService.getAll().catch(() => []),
      classTypesService.getAll().catch(() => []),
    ]);
    setClasses(schedulesData);
    setInstructors(instructorsData);
    setClassTypes(classTypesData);
  }

  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      await schedulesService.create({
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        capacity: Number(capacity),
        classTypeId,
        instructorId,
      });

      setStartTime("");
      setEndTime("");
      setCapacity(10);
      setClassTypeId(classTypes.length > 0 ? classTypes[0].id : "");
      setInstructorId("");

      await refreshData();
    } catch (error: unknown) {
      setFormError(getApiErrorMessage(error, "Error al crear la clase"));
    }
  }

  async function handleCreateClassType(e: React.FormEvent) {
    e.preventDefault();
    setTypeFormError(null);
    setTypeFormSuccess(null);
    try {
      await classTypesService.create({
        name: newTypeName,
        description: newTypeDesc || undefined,
        durationMin: Number(newTypeDuration),
      });

      setTypeFormSuccess("¡Tipo de clase creado con éxito!");
      setNewTypeName("");
      setNewTypeDesc("");
      setNewTypeDuration(60);

      await refreshData();
    } catch (error: unknown) {
      setTypeFormError(
        getApiErrorMessage(error, "Error al crear el tipo de clase"),
      );
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestioná los horarios, clases y disciplinas del gimnasio.
          </p>
        </div>

        <div className="flex bg-muted p-1 rounded-lg gap-1 border border-border">
          <button
            onClick={() => setActiveTab("schedules")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "schedules"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="size-4" /> Horarios y Clases
          </button>
          <button
            onClick={() => setActiveTab("class-types")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "class-types"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Tag className="size-4" /> Tipos de Clases
          </button>
        </div>
      </div>

      {activeTab === "schedules" && (
        <div className="space-y-8">
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
                          {ins.user.fullName}
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
                      <span>
                        Inicio: {new Date(c.startTime).toLocaleString()}
                      </span>
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
      )}

      {activeTab === "class-types" && (
        <div className="space-y-8">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg">
                Crear Nueva Disciplina / Tipo de Clase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateClassType} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nombre de la Disciplina
                    </label>
                    <Input
                      type="text"
                      placeholder="Ej: Spinning, Yoga, Pilates..."
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Descripción (Opcional)
                    </label>
                    <Input
                      type="text"
                      placeholder="Ej: Clase de alta intensidad..."
                      value={newTypeDesc}
                      onChange={(e) => setNewTypeDesc(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Duración (minutos)
                    </label>
                    <Input
                      type="number"
                      value={newTypeDuration}
                      onChange={(e) =>
                        setNewTypeDuration(Number(e.target.value))
                      }
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 text-black hover:bg-emerald-600 font-semibold"
                >
                  <Plus className="mr-2 size-4" /> Registrar Tipo de Clase
                </Button>

                {typeFormError && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                    {typeFormError}
                  </div>
                )}

                {typeFormSuccess && (
                  <div className="p-3 text-sm text-emerald-600 bg-emerald-50 rounded-md border border-emerald-200">
                    {typeFormSuccess}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classTypes.length === 0 ? (
              <p className="text-muted-foreground col-span-full text-center py-6">
                No hay tipos de clases registrados todavía.
              </p>
            ) : (
              classTypes.map((ct) => (
                <Card
                  key={ct.id}
                  className="border-border bg-card flex flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Dumbbell className="size-5 text-emerald-500" />
                      <span>{ct.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>{ct.description || "Sin descripción detallada."}</p>
                    <div className="flex items-center gap-2 pt-2">
                      <Clock className="size-4 text-emerald-500" />
                      <span>Duración estimada: {ct.durationMin} min</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

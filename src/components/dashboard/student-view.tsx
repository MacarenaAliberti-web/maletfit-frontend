// components/dashboard/dashboard-view.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, LayoutGrid } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { AvailableClasses } from "@/components/available-classes";
import { MyReservations } from "@/components/my-reservations";
import { type GymClass } from "@/lib/gym-data";

type Tab = "clases" | "reservas";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [reservedIds, setReservedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<Tab>("clases");

  // 1. Cargar las clases (schedules) y las reservas del usuario al iniciar
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Petición a tus endpoints reales de Swagger
        const [classesRes, bookingsRes] = await Promise.all([
          fetch("http://localhost:3000/api/schedules", {
            credentials: "include",
          }),
          fetch("http://localhost:3000/api/bookings/my-bookings", {
            credentials: "include",
          }),
        ]);

        if (classesRes.ok) {
          const classesData = await classesRes.json();
          setClasses(classesData);
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          // Suponiendo que la respuesta trae un array de reservas que contienen el id de la clase
          const bookedClassIds = bookingsData.map(
            (b: any) => b.scheduleId || b.id,
          );
          setReservedIds(bookedClassIds);
        }
      } catch (error) {
        console.error("Error al sincronizar con el backend:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const reservations = useMemo(
    () => classes.filter((c) => reservedIds.includes(c.id)),
    [classes, reservedIds],
  );

  // 2. Manejar la reserva llamando a POST /bookings
  async function handleReserve(id: string) {
    try {
      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ scheduleId: id }), // Ajustá la propiedad según lo que pida tu backend
      });

      if (!response.ok) throw new Error("No se pudo concretar la reserva");

      setReservedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setClasses((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, booked: Math.min(c.capacity, c.booked + 1) }
            : c,
        ),
      );
    } catch (error) {
      console.error("Error al reservar turno:", error);
    }
  }

  // 3. Manejar la cancelación llamando a PATCH /bookings/{id}/cancel
  async function handleCancel(id: string) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/bookings/${id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      if (!response.ok) throw new Error("No se pudo cancelar la reserva");

      setReservedIds((prev) => prev.filter((x) => x !== id));
      setClasses((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, booked: Math.max(0, c.booked - 1) } : c,
        ),
      );
    } catch (error) {
      console.error("Error al cancelar el turno:", error);
    }
  }

  const tabs: { key: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { key: "clases", label: "Clases", icon: LayoutGrid },
    { key: "reservas", label: "Mis reservas", icon: CalendarCheck },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse text-lg">
          Cargando clases desde el servidor...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <nav
          className="mb-6 inline-flex rounded-xl border border-border bg-card p-1"
          aria-label="Secciones"
        >
          {tabs.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            const count = key === "reservas" ? reservations.length : 0;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-500 text-black shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {label}
                {key === "reservas" && count > 0 && (
                  <span
                    className={`flex size-5 items-center justify-center rounded-full text-xs font-semibold ${
                      active
                        ? "bg-black/20 text-black"
                        : "bg-emerald-500/15 text-emerald-400"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {tab === "clases" ? (
          <AvailableClasses
            classes={classes}
            reservedIds={reservedIds}
            onReserve={handleReserve}
          />
        ) : (
          <MyReservations reservations={reservations} onCancel={handleCancel} />
        )}
      </main>
    </div>
  );
}

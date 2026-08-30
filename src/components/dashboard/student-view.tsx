// src/components/dashboard/student-view.tsx
"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, LayoutGrid, Dumbbell } from "lucide-react";
import { schedulesService } from "@/services/schedules.service";
import { bookingsService } from "@/services/bookings.service";
import { routinesService } from "@/services/routines.service";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { ActiveClassesList } from "./student/active-classes-list";
import { MyBookingsList } from "./student/my-bookings-list";
import { MyRoutinesList } from "./student/my-routines-list";
import type { Schedule } from "@/types/schedule";
import type { Booking } from "@/types/booking";
import type { Routine } from "@/types/routine";

type Tab = "clases" | "reservas" | "rutinas";

export default function StudentDashboardView() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("clases");

  const [reservingScheduleId, setReservingScheduleId] = useState<string | null>(
    null,
  );
  const [reserveError, setReserveError] = useState<string | null>(null);

  const [cancelingBookingId, setCancelingBookingId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const [schedulesData, bookingsData, routinesData] = await Promise.all([
          schedulesService.getAll(),
          bookingsService.getMyBookings(),
          routinesService.getMyRoutines(),
        ]);
        if (!ignore) {
          setSchedules(schedulesData);
          setBookings(bookingsData);
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

  // No incluye routines a propósito: las rutinas no cambian al reservar
  // o cancelar una clase, así que refetchearlas acá sería innecesario.
  async function refreshData() {
    const [schedulesData, bookingsData] = await Promise.all([
      schedulesService.getAll(),
      bookingsService.getMyBookings(),
    ]);
    setSchedules(schedulesData);
    setBookings(bookingsData);
  }

  async function handleReserve(scheduleId: string) {
    setReserveError(null);
    setReservingScheduleId(scheduleId);
    try {
      await bookingsService.create(scheduleId);
      await refreshData();
    } catch (error: unknown) {
      setReserveError(
        getApiErrorMessage(error, "No se pudo completar la reserva."),
      );
    } finally {
      setReservingScheduleId(null);
    }
  }

  async function handleCancel(bookingId: string) {
    setCancelingBookingId(bookingId);
    try {
      await bookingsService.cancel(bookingId);
      await refreshData();
    } catch (error: unknown) {
      setReserveError(
        getApiErrorMessage(error, "No se pudo cancelar la reserva."),
      );
    } finally {
      setCancelingBookingId(null);
    }
  }

  const activeBookingsCount = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "WAITLIST",
  ).length;

  const tabs: { key: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { key: "clases", label: "Clases", icon: LayoutGrid },
    { key: "reservas", label: "Mis reservas", icon: CalendarCheck },
    { key: "rutinas", label: "Mis rutinas", icon: Dumbbell },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse text-lg">
          Cargando clases...
        </p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-red-500">{loadError}</p>
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
            const count = key === "reservas" ? activeBookingsCount : 0;
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

        {reserveError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-500">
            {reserveError}
          </div>
        )}

        {tab === "clases" ? (
          <ActiveClassesList
            schedules={schedules}
            bookings={bookings}
            reservingScheduleId={reservingScheduleId}
            onReserve={handleReserve}
          />
        ) : tab === "reservas" ? (
          <MyBookingsList
            bookings={bookings}
            cancelingBookingId={cancelingBookingId}
            onCancel={handleCancel}
          />
        ) : (
          <MyRoutinesList routines={routines} />
        )}
      </main>
    </div>
  );
}

// src/components/dashboard/shared/schedule-roster.tsx
"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { schedulesService } from "@/services/schedules.service";
import { bookingsService } from "@/services/bookings.service";
import type {
  ScheduleRoster as ScheduleRosterType,
  RosterEntry,
} from "@/types/roster";

interface ScheduleRosterProps {
  scheduleId: string;
}

export function ScheduleRoster({ scheduleId }: ScheduleRosterProps) {
  const [roster, setRoster] = useState<ScheduleRosterType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
    null,
  );

  async function handleToggle() {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);

    if (roster) return; // ya lo cargamos antes, no volvemos a pedirlo

    setIsLoading(true);
    setError(null);
    try {
      const data = await schedulesService.getRoster(scheduleId);
      setRoster(data);
    } catch {
      setError("No se pudo cargar la lista de alumnos.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMarkAttendance(
    bookingId: string,
    status: "ATTENDED" | "NO_SHOW",
  ) {
    setUpdatingBookingId(bookingId);
    setError(null);
    try {
      await bookingsService.markAttendance(bookingId, status);
      // Refrescamos el roster para reflejar el nuevo estado
      const data = await schedulesService.getRoster(scheduleId);
      setRoster(data);
    } catch {
      setError("No se pudo actualizar la asistencia.");
    } finally {
      setUpdatingBookingId(null);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={handleToggle}
      >
        {isOpen ? "Ocultar alumnos" : "Ver alumnos"}
      </Button>

      {isOpen && (
        <div className="space-y-2 border-t border-border pt-3">
          {isLoading && (
            <div className="flex items-center justify-center py-4 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {roster && (
            <>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Confirmados ({roster.confirmed.length})
                </p>
                {roster.confirmed.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Sin alumnos confirmados.
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {roster.confirmed.map((entry) => (
                      <RosterRow
                        key={entry.id}
                        entry={entry}
                        isUpdating={updatingBookingId === entry.id}
                        onMarkAttendance={handleMarkAttendance}
                      />
                    ))}
                  </ul>
                )}
              </div>

              {roster.waitlist.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 mt-3">
                    Lista de espera ({roster.waitlist.length})
                  </p>
                  <ul className="space-y-1">
                    {roster.waitlist.map((entry) => (
                      <li
                        key={entry.id}
                        className="text-sm text-muted-foreground"
                      >
                        {entry.user.fullName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface RosterRowProps {
  entry: RosterEntry;
  isUpdating: boolean;
  onMarkAttendance: (bookingId: string, status: "ATTENDED" | "NO_SHOW") => void;
}

function RosterRow({ entry, isUpdating, onMarkAttendance }: RosterRowProps) {
  const isAttended = entry.status === "ATTENDED";
  const isNoShow = entry.status === "NO_SHOW";

  return (
    <li className="flex items-center justify-between text-sm">
      <span>
        {entry.user.fullName}
        {isAttended && (
          <span className="ml-2 text-xs text-emerald-500">(Asistió)</span>
        )}
        {isNoShow && (
          <span className="ml-2 text-xs text-red-400">(Ausente)</span>
        )}
      </span>

      <div className="flex gap-1">
        {isUpdating ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <>
            <button
              onClick={() => onMarkAttendance(entry.id, "ATTENDED")}
              disabled={isAttended}
              className={
                isAttended
                  ? "text-emerald-500 cursor-default"
                  : "text-muted-foreground hover:text-emerald-500"
              }
              title={
                isAttended ? "Ya marcado como presente" : "Marcar como presente"
              }
            >
              <CheckCircle2 className="size-4" />
            </button>
            <button
              onClick={() => onMarkAttendance(entry.id, "NO_SHOW")}
              disabled={isNoShow}
              className={
                isNoShow
                  ? "text-red-400 cursor-default"
                  : "text-muted-foreground hover:text-red-400"
              }
              title={
                isNoShow ? "Ya marcado como ausente" : "Marcar como ausente"
              }
            >
              <XCircle className="size-4" />
            </button>
          </>
        )}
      </div>
    </li>
  );
}

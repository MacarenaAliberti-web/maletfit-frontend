// src/components/dashboard/instructor/schedule-roster.tsx
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
    try {
      await bookingsService.markAttendance(bookingId, status);
      // Refrescamos el roster para reflejar el nuevo estado
      const data = await schedulesService.getRoster(scheduleId);
      setRoster(data);
    } catch {
      setError("No se pudo actualizar la asistencia.");
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
  onMarkAttendance: (bookingId: string, status: "ATTENDED" | "NO_SHOW") => void;
}

function RosterRow({ entry, onMarkAttendance }: RosterRowProps) {
  const alreadyMarked =
    entry.status === "ATTENDED" || entry.status === "NO_SHOW";

  return (
    <li className="flex items-center justify-between text-sm">
      <span className={alreadyMarked ? "text-muted-foreground" : ""}>
        {entry.user.fullName}
        {entry.status === "ATTENDED" && (
          <span className="ml-2 text-xs text-emerald-500">(Asistió)</span>
        )}
        {entry.status === "NO_SHOW" && (
          <span className="ml-2 text-xs text-red-400">(Ausente)</span>
        )}
      </span>

      {!alreadyMarked && (
        <div className="flex gap-1">
          <button
            onClick={() => onMarkAttendance(entry.id, "ATTENDED")}
            className="text-emerald-500 hover:text-emerald-400"
            title="Marcar como presente"
          >
            <CheckCircle2 className="size-4" />
          </button>
          <button
            onClick={() => onMarkAttendance(entry.id, "NO_SHOW")}
            className="text-red-400 hover:text-red-300"
            title="Marcar como ausente"
          >
            <XCircle className="size-4" />
          </button>
        </div>
      )}
    </li>
  );
}

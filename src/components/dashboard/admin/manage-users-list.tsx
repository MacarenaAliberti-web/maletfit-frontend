// src/components/dashboard/admin/manage-users-list.tsx
"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  usersService,
  type UserSummary,
  type UserRole,
} from "@/services/users.service";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { useAuth } from "@/context/auth-context";

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrador",
  INSTRUCTOR: "Instructor",
  STUDENT: "Alumno",
};

export function ManageUsersList() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<{
    userId: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadUsers() {
      try {
        const data = await usersService.getAll();
        if (!ignore) {
          setUsers(data);
        }
      } catch {
        if (!ignore) {
          setLoadError("No se pudo cargar la lista de usuarios.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleRoleChange(userId: string, newRole: UserRole) {
    setRowError(null);
    setUpdatingUserId(userId);
    try {
      const updatedUser = await usersService.updateRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
    } catch (error: unknown) {
      setRowError({
        userId,
        message: getApiErrorMessage(error, "No se pudo cambiar el rol."),
      });
    } finally {
      setUpdatingUserId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Cargando usuarios...
      </div>
    );
  }

  if (loadError) {
    return <div className="p-8 text-center text-red-500">{loadError}</div>;
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="size-5 text-emerald-500" />
          Gestión de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <div className="flex items-center gap-2">
                {updatingUserId === user.id ? (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                ) : user.id === currentUser?.id ? (
                  <span className="text-sm text-muted-foreground italic">
                    {roleLabels[user.role]} (vos)
                  </span>
                ) : (
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as UserRole)
                    }
                    className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                      <option key={role} value={role}>
                        {roleLabels[role]}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {rowError?.userId === user.id && (
                <p className="text-xs text-red-500 sm:basis-full">
                  {rowError.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

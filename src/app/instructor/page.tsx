// src/components/dashboard/admin-dashboard-view.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Panel del Instructor
          </h1>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center gap-4">
            <ShieldAlert className="h-8 w-8 text-emerald-500" />
            <CardTitle className="text-lg">Gestión de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Aquí estará el dashboard del Instructor, donde se podrá ver la
              lista de alumnos y sus datos.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

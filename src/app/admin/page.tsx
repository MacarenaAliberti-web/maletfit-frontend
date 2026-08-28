// src/components/dashboard/admin-dashboard-view.tsx
import AdminClassesView from "@/components/dashboard/admin-classes-view";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Panel de Administración
          </h1>
        </div>

        {/* Aquí llamamos al componente que maneja las clases */}
        <AdminClassesView />
      </main>
    </div>
  );
}

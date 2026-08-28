// src/app/admin/page.tsx
import AdminClassesView from "@/components/dashboard/admin-classes-view";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        <AdminClassesView />
      </main>
    </div>
  );
}

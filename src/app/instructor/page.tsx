// src/app/instructor/page.tsx
import InstructorDashboardView from "@/components/dashboard/instructor-dashboard-view";

export default function InstructorPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        <InstructorDashboardView />
      </main>
    </div>
  );
}

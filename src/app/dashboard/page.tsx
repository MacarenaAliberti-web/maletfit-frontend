// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUserServer } from "@/lib/get-current-user-server";

export default async function DashboardIndexPage() {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect("/login");
  }

  switch (user.role) {
    case "STUDENT":
      redirect("/student");
    case "INSTRUCTOR":
      redirect("/instructor");
    case "ADMIN":
      redirect("/admin");
  }
}

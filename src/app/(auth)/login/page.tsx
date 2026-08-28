// src/app/(auth)/login/page.tsx
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión | MaletFit",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-background">
      <LoginForm />
    </main>
  );
}

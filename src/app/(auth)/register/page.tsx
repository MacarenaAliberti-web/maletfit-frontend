// src/app/register/page.tsx
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[85vh] items-center justify-center p-4">
      <RegisterForm />
    </main>
  );
}

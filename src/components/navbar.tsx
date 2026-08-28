"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Dumbbell, LogOut } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-emerald-500" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Malet<span className="text-emerald-500">Fit</span>
          </span>
        </Link>

        {/* Acciones según si está logueado o no */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                {user.email} ({user.role})
              </span>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-2"
              >
                <LogOut size={16} />
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="bg-emerald-500 text-black hover:bg-emerald-600 text-sm font-semibold px-4 py-2 rounded-md transition-all"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background text-foreground">
      {/* Navbar principal reutilizable unificado */}

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Entrená a tu ritmo,{" "}
          <span className="text-emerald-500">gestiona tus turnos</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
          Bienvenido a MaletFit. La plataforma definitiva para reservar clases,
          organizar tus rutinas y llevar tu rendimiento físico al siguiente
          nivel.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/login"
            className={buttonVariants({
              size: "lg",
              className:
                "bg-emerald-500 text-black hover:bg-emerald-600 font-semibold",
            })}
          >
            Comenzar Ahora
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border hover:border-emerald-800 transition-all">
          <CardHeader className="flex flex-row items-center gap-4">
            <Calendar className="h-8 w-8 text-emerald-500" />
            <CardTitle className="text-lg">Reservas Inteligentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Anotate en tus turnos preferidos con control de cupos en tiempo
              real y listas de espera automáticas.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-emerald-800 transition-all">
          <CardHeader className="flex flex-row items-center gap-4">
            <Users className="h-8 w-8 text-emerald-500" />
            <CardTitle className="text-lg">Instructores Expertos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Clases guiadas por profesionales enfocados en potenciar tu
              desarrollo físico y bienestar.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-emerald-800 transition-all">
          <CardHeader className="flex flex-row items-center gap-4">
            <ShieldCheck className="h-8 w-8 text-emerald-500" />
            <CardTitle className="text-lg">Seguro y Confiable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tus datos y tus reservas protegidos bajo los más altos estándares
              de seguridad y tecnología.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} MaletFit. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}

// app/page.tsx
"import client";
"use client";

import { useState } from "react";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>("Sin probar");
  const [inputValue, setInputValue] = useState<string>("");

  const testBackendConnection = async () => {
    try {
      setBackendStatus("Conectando...");
      // Intentamos pegarle a la ruta raíz de tu backend (o un endpoint público)
      const response = await api.get("/");
      setBackendStatus(
        `¡Conexión exitosa! Respuesta: ${JSON.stringify(response.data)}`,
      );
    } catch (error: any) {
      setBackendStatus(
        `Error al conectar: ${error.message} (¿Está corriendo NestJS en el puerto 3000?)`,
      );
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 gap-6 bg-background text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            MaletFit Frontend - Test Milestone 1
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              1. Prueba de componentes UI (Shadcn + v0):
            </p>
            <Input
              placeholder="Escribí algo acá..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              2. Prueba de Axios y Backend:
            </p>
            <Button onClick={testBackendConnection} className="w-full">
              Probar conexión con Backend
            </Button>
            <p className="text-xs mt-2 p-2 bg-muted rounded">
              <strong>Estado:</strong> {backendStatus}
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

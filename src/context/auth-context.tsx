// context/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { LoginFormValues } from "@/lib/validations/auth";

// Definimos la estructura del usuario
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginFormValues) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Al montar la app, verificamos si la cookie HttpOnly sigue siendo válida pidiendo los datos del usuario
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((data) => {
        // Dependiendo de cómo devuelva el backend el /users/me, puede venir directo o envuelto en { user }
        setUser(data.user || data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (credentials: LoginFormValues) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    router.push("/dashboard"); // Redirige al panel principal tras iniciar sesión
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      router.push("/auth/login"); // Redirige al login tras salir
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto fácilmente y con seguridad (Fail Fast)
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}

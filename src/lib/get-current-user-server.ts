// src/lib/get-current-user-server.ts
import { cookies } from "next/headers";
import type { User } from "@/types/auth";

export async function getCurrentUserServer(): Promise<User | null> {
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("jwt");

    if (!jwtCookie) {
        return null;
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            headers: {
                // Reenviamos la cookie manualmente — un Server Component
                // no tiene el mismo comportamiento automático que el browser
                Cookie: `jwt=${jwtCookie.value}`,
            },
            cache: "no-store", // nunca cachear datos de sesión de un usuario específico
        });

        if (!response.ok) {
            return null;
        }

        const user = (await response.json()) as User;
        return user;
    } catch {
        return null;
    }
}
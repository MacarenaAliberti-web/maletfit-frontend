// src/lib/server-fetch.ts
import { cookies } from "next/headers";

export class ServerFetchError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ServerFetchError";
    }
}

export async function serverFetch<T>(path: string): Promise<T> {
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("jwt");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
        headers: jwtCookie ? { Cookie: `jwt=${jwtCookie.value}` } : {},
        cache: "no-store",
    });

    if (!response.ok) {
        throw new ServerFetchError(response.status, `Error al pedir ${path}`);
    }

    return response.json() as Promise<T>;
}
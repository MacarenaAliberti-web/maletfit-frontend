// src/lib/get-api-error-message.ts
import axios from "axios";

export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as
            | { message?: string | string[] }
            | undefined;
        const msg = data?.message;
        return Array.isArray(msg) ? msg.join(", ") : (msg ?? fallback);
    }
    return fallback;
}
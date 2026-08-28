// lib/validations/auth.ts
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Ingresá un correo electrónico válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
    fullName: z.string().min(2, 'Ingresá tu nombre completo').optional(),
    email: z.string().email('Ingresá un correo electrónico válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
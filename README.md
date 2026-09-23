# MaletFit Frontend 🏋️‍♂️💪

Frontend de **MaletFit**, una plataforma de gestión de turnos, reservas y rutinas para gimnasios. Construido con Next.js (App Router), TypeScript, Tailwind CSS y Shadcn UI, consumiendo la [API de MaletFit Backend](https://github.com/MacarenaAliberti-web/maletfit-backend).

---

## 🚀 Tecnologías

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes:** [Shadcn UI](https://ui.shadcn.com/)
- **Cliente HTTP:** [Axios](https://axios-http.com/)
- **Autenticación:** JWT en cookies httpOnly (no localStorage, no `js-cookie`) — ver sección de Auth más abajo

---

## 👥 Roles y dashboards

La app tiene 3 dashboards independientes, cada uno con su propia ruta de primer nivel y protegidos por rol tanto en el frontend (`middleware.ts`) como en el backend:

| Ruta          | Rol        | Funcionalidad                                                                                           |
| ------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `/student`    | Alumno     | Ver clases disponibles, reservar (o entrar a lista de espera), cancelar reservas, ver rutinas asignadas |
| `/instructor` | Instructor | Programar turnos propios, ver roster y marcar asistencia, crear/editar rutinas                          |
| `/admin`      | Admin      | Todo lo del instructor + gestión de tipos de clase + gestión de usuarios y roles                        |

`/dashboard` no es una vista en sí — es un redirector server-side (`getCurrentUserServer()`) que manda a cada usuario a su dashboard según su rol al hacer login.

---

## 📂 Estructura del proyecto

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── admin/page.tsx
│   ├── instructor/page.tsx
│   ├── student/page.tsx
│   ├── dashboard/page.tsx      # Redirector por rol (Server Component)
│   ├── layout.tsx
│   └── page.tsx                # Landing pública
│
├── components/
│   ├── auth/                   # login-form, register-form
│   ├── dashboard/
│   │   ├── admin/               # Exclusivo de admin (manage-users-list)
│   │   ├── instructor/          # Exclusivo de instructor (create-schedule-form,
│   │   │                          depende de getMyProfile())
│   │   ├── shared/               # Reusado entre admin e instructor:
│   │   │                          create-routine-form, edit-routine-form,
│   │   │                          assigned-routines-list, schedule-roster
│   │   ├── student/              # Exclusivo de alumno: active-classes-list,
│   │   │                          my-bookings-list, my-routines-list, schedule-card
│   │   ├── admin-classes-view.tsx
│   │   ├── instructor-dashboard-view.tsx
│   │   └── student-view.tsx
│   └── ui/                      # Componentes base de Shadcn UI + navbar
│
├── context/
│   └── auth-context.tsx         # useAuth() — estado de sesión global
│
├── lib/
│   ├── server-data/               # Fetchers que corren en Server Components
│   ├── validations/                # Schemas de Zod (React Hook Form)
│   ├── get-api-error-message.ts    # Extrae mensajes de error de Axios de forma tipada
│   ├── get-current-user-server.ts  # Lee la cookie httpOnly en Server Components
│   ├── server-fetch.ts             # Helper genérico de fetch autenticado (servidor)
│   └── utils.ts                    # cn() de Shadcn
│
├── services/                     # Llamadas HTTP desde el CLIENTE (withCredentials)
│   ├── api.ts                     # Instancia de Axios central
│   ├── auth.service.ts
│   ├── bookings.service.ts
│   ├── class-types.service.ts
│   ├── instructors.service.ts
│   ├── routines.service.ts
│   ├── schedules.service.ts
│   └── users.service.ts
│
├── types/                         # Tipos alineados 1:1 con las respuestas del backend
│   ├── auth.ts
│   ├── booking.ts
│   ├── class-type.ts
│   ├── instructor.ts
│   ├── roster.ts
│   ├── routine.ts
│   └── schedule.ts
│
└── proxy.ts                       # Protección de rutas por rol + redirect (Next.js 16: proxy.ts, no middleware.ts)
```

**`services/` vs `lib/server-data/` — por qué existen ambas:** `services/` son las llamadas que hace un **Client Component** (`"use client"`) usando Axios con `withCredentials: true` — la cookie httpOnly viaja sola porque corre en el navegador. `lib/server-data/` son fetchers que corren en **Server Components**, donde no hay navegador que adjunte la cookie automáticamente — por eso `server-fetch.ts` la lee manualmente con `next/headers` y la reenvía a mano en el header `Cookie` de cada request.

---

## 🔐 Autenticación

El JWT vive en una **cookie httpOnly**, seteada por el backend en `/auth/login` — nunca en `localStorage` ni accesible desde JavaScript del cliente (mitiga robo de token vía XSS).

- **`services/api.ts`**: instancia de Axios con `withCredentials: true`. No hace falta ningún interceptor que adjunte un header `Authorization` — la cookie viaja sola en cada request del navegador.
- **Interceptor de respuesta**: si el backend devuelve `401` (y no es el propio chequeo de sesión en `/users/me`, para evitar un loop de redirects), redirige a `/login`.
- **`proxy.ts`**: protege `/admin`, `/instructor`, `/student` — si no hay cookie, redirige a `/login`. Es una primera capa (solo verifica que la cookie _exista_); la validación real del token la hace el backend en cada request. En Next.js 16, este archivo reemplaza a la antigua convención `middleware.ts` (deprecada) — el nombre del archivo y de la función exportada deben ser exactamente `proxy.ts` / `proxy`, o Next.js lo ignora sin avisar.
- **`AuthContext`**: al montar la app, confirma la sesión contra `/users/me` (no confía ciegamente en un estado persistido).

---

## ⚙️ Configuración y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/MacarenaAliberti-web/maletfit-frontend.git
cd maletfit-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Creá `.env.local` en la raíz:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Levantar el backend

Este frontend necesita el [backend de MaletFit](https://github.com/MacarenaAliberti-web/maletfit-backend) corriendo en paralelo (ver su propio README para el setup).

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

---

## 🗂️ Patrones de arquitectura aplicados

- **Server Components para carga inicial, Client Components para interactividad**: cada página de dashboard resuelve al usuario del lado del servidor cuando corresponde; los formularios y acciones (reservar, cancelar, marcar asistencia) son componentes chicos y específicos con `"use client"`.
- **Componentes compartidos por responsabilidad, no por rol**: `dashboard/shared/` agrupa lo que dos roles usan igual (rutinas, roster), evitando duplicar lógica entre `admin-classes-view.tsx` e `instructor-dashboard-view.tsx`.
- **Patrón `ignore` en efectos de carga de datos**: evita `setState` sobre componentes desmontados y condiciones de carrera si un efecto se re-ejecuta antes de que termine el fetch anterior.
- **Refetch en vez de actualización optimista local**: después de reservar, cancelar, marcar asistencia o cambiar un rol, el frontend vuelve a pedirle el estado real al backend en vez de "adivinar" el resultado — importante en un sistema con lista de espera automática, donde el estado final depende de una decisión del servidor.

---

## 📚 Documentación adicional

- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — cómo se desplegó a producción (Render + Vercel) y el problema de cookies cross-domain que hubo que resolver
- [README del backend](https://github.com/MacarenaAliberti-web/maletfit-backend) — arquitectura, condiciones de carrera, testing y sistema de emails

---

## 👩‍💻 Autora

- **Macarena Aliberti** — _Desarrollo Full Stack_
- **GitHub:** [@MacarenaAliberti-web](https://github.com/MacarenaAliberti-web)
- **LinkedIn:** [macarena-aliberti](https://www.linkedin.com/in/macarena-aliberti-440b03373/)

# Deploy de MaletFit — Guía completa

Este documento detalla cómo se desplegó MaletFit a producción, y sobre todo **por qué** cada ajuste fue necesario — varios de los problemas que aparecieron no eran errores de configuración triviales, sino consecuencias reales de tener frontend y backend en dominios distintos.

**Arquitectura final:**

```
Frontend (Next.js)  → Vercel        → https://maletfit-frontend.vercel.app
Backend (NestJS)    → Render        → https://maletfit-backend.onrender.com
Base de datos        → Supabase      → (sin cambios, ya estaba en la nube)
```

---

## Parte 1 — Backend en Render

### Por qué Render y no Railway

Railway dejó de tener un free tier permanente (solo un crédito único de prueba para cuentas nuevas). Render sí mantiene un plan gratuito real, sin tarjeta de crédito — ideal para un proyecto de portfolio. La contrapartida: el servicio "duerme" tras 15 minutos de inactividad, y la primera request después de eso tarda 30-50 segundos (cold start). Vale la pena advertirlo en el README para quien pruebe la demo.

### Configuración del servicio

- **Runtime:** Node
- **Build Command:**
  ```bash
  npm install --include=dev && npx prisma generate && npx prisma migrate deploy && npx nest build
  ```
- **Start Command:**
  ```bash
  npm run start:prod
  ```
- **Plan:** Free

### Variables de entorno

| Variable       | Valor                                  |
| -------------- | -------------------------------------- |
| `DATABASE_URL` | Connection string pooled de Supabase   |
| `DIRECT_URL`   | Connection string directa de Supabase  |
| `JWT_SECRET`   | Mismo valor que en local               |
| `FRONTEND_URL` | `https://maletfit-frontend.vercel.app` |
| `NODE_ENV`     | `production`                           |

### Problemas encontrados y cómo se resolvieron

**1. `Error: P1013: The provided database string is invalid`**
Causa: al pegar `DATABASE_URL`/`DIRECT_URL` en el campo de Render, quedaron comillas incluidas (copiadas tal cual del `.env` local, donde sí van entre comillas). En el campo "value" de Render **no van comillas**, solo el string pelado. Corrección: pegar el valor sin comillas ni espacios extra.

**2. `sh: 1: nest: not found`**
Causa: `nest build` (dentro de `npm run build`) depende del binario `nest`, que provee el paquete `@nestjs/cli` — instalado como `devDependency`. Corrección: usar `npx nest build` en vez de `npm run build`, para forzar el uso del binario ya instalado en `node_modules/.bin`, sin depender del PATH global.

**3. `npm error could not determine executable to run`**
Causa real y más profunda que el punto 2: con `NODE_ENV=production` seteado como variable de entorno, `npm install` **omite las devDependencies por defecto** — así que `@nestjs/cli` nunca llegaba a instalarse en el contenedor de Render, y ni siquiera `npx` podía encontrarlo. Corrección: `npm install --include=dev`, forzando la instalación completa aunque `NODE_ENV` diga `production`. Esto es seguro: las devDependencies (CLI, TypeScript) solo hacen falta durante el build; una vez generado `dist/`, el `start:prod` (`node dist/main`) no las necesita para nada en runtime.

### Verificación

`https://maletfit-backend.onrender.com/api/docs` debe cargar Swagger con todos los endpoints listados.

---

## Parte 2 — Frontend en Vercel

### Configuración inicial

Vercel detecta Next.js automáticamente — no requiere build/start command manual como Render.

### Variables de entorno (versión inicial, incompleta)

| Variable              | Valor                                   |
| --------------------- | --------------------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://maletfit-backend.onrender.com` |

Con solo esta variable, el primer deploy funcionó a medias: la landing cargaba, pero **el login nunca dejaba entrar al dashboard** — este fue el problema más importante de todo el proceso, detallado abajo.

---

## Parte 3 — El problema real: cookies httpOnly entre dominios distintos

### El síntoma

Después del primer deploy: el login devolvía `200 OK`, el navbar mostraba el usuario logueado (el estado de React se actualizaba bien), pero al navegar a `/student` (o cualquier dashboard), la app rebotaba de vuelta a `/login` — como si la sesión no existiera.

### La causa raíz

El backend setea la cookie `jwt` con dominio `maletfit-backend.onrender.com` (el dominio del que responde la petición). El navegador **solo envía una cookie a requests dirigidas al dominio exacto al que pertenece** — nunca la manda a un dominio distinto, aunque sea la misma persona en la misma pestaña.

El frontend en Next.js tiene código que corre **en el servidor** (Server Components, `proxy.ts`, `getCurrentUserServer()`) para leer esa cookie y decidir si el usuario está logueado. Pero ese código corre físicamente en los servidores de **Vercel**, procesando requests que llegan a `vercel.app` — y esas requests **nunca traen la cookie de `onrender.com`**, porque el navegador jamás la adjunta ahí.

**¿Por qué funcionaba en local?** Pura casualidad de nombres: en desarrollo, frontend (`localhost:3001`) y backend (`localhost:3000`) usan puertos distintos, pero el **mismo hostname** (`localhost`). Las cookies no distinguen por puerto, solo por dominio — así que, sin que lo supiéramos, frontend y backend "compartían" la cookie en local. En producción, con dominios genuinamente distintos, esa casualidad desaparece y el problema queda expuesto.

### La solución: un proxy dentro de Next.js

En vez de que el navegador hable directamente con `onrender.com`, todas las llamadas de la API pasan primero por el propio dominio del frontend (`/api/...`), y es **Next.js quien las reenvía al backend real por detrás, del lado del servidor**. Desde la perspectiva del navegador, todo es "mismo origen" — la cookie que llega en la respuesta queda scopeada al dominio del frontend, y tanto el cliente como el servidor de Next.js pueden leerla sin problema.

**`next.config.ts`:**

```typescript
import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

**`services/api.ts`** — cambio de una línea:

```typescript
// Antes:
baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
// Después:
baseURL: '/api',
```

Ahora, cuando el frontend llama a `/api/auth/login`, Next.js lo intercepta y lo reenvía a `${BACKEND_URL}/auth/login` — transparente para el navegador.

### Detalle clave: `BACKEND_URL` vs `NEXT_PUBLIC_API_URL`

Son dos variables con roles distintos, y ambas siguen siendo necesarias:

- **`BACKEND_URL`** (sin prefijo `NEXT_PUBLIC_`): la lee `next.config.ts`, que corre **solo en el servidor**. No debe tener el prefijo público, porque no necesita exponerse al navegador.
- **`NEXT_PUBLIC_API_URL`**: la siguen usando `lib/get-current-user-server.ts` y `lib/server-fetch.ts`, que hacen fetch **directo servidor-a-servidor** hacia el backend real (reenviando la cookie manualmente vía `next/headers`, sin depender del navegador). Ese mecanismo nunca tuvo el problema de cookies cross-domain, porque no es el navegador quien decide si la envía — es código que arma el header a mano.

### El error que casi bloquea todo: variable de entorno con ambiente equivocado

Al configurar `BACKEND_URL` en Vercel, quedó guardada solo para el ambiente **"Development"**, no para **"Production"**. Como las variables usadas en `next.config.ts` se leen **en tiempo de build**, el deploy de producción usó el fallback `http://localhost:3000` (que no existe en los servidores de Vercel), resultando en `404` en cada request a `/api/*`.

**Lección:** al agregar una variable de entorno en Vercel, confirmar explícitamente en qué ambientes aplica (Production / Preview / Development) — no asumir que "Production" está tildado por defecto.

**Y un segundo detalle:** después de corregir una variable usada en `next.config.ts`, no alcanza con un simple "Redeploy" del build existente — hay que forzar una reconstrucción real (desmarcando "Use existing Build Cache"), porque el valor de la variable queda "horneado" en el build anterior.

---

## Parte 4 — Ajuste de cookies para producción

Independientemente del proxy, las cookies necesitaban un ajuste para funcionar bajo HTTPS real en dos dominios:

```typescript
// auth.controller.ts
private setAuthCookie(res: Response, token: string) {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: COOKIE_MAX_AGE_MS,
        path: '/',
    });
}
```

`sameSite: 'lax'` (que funciona bien en local) bloquea cookies en la mayoría de los escenarios cross-site reales. `sameSite: 'none'` lo permite, pero exige `secure: true` (solo HTTPS) — condición que ya se cumple en producción. El mismo ajuste se replicó en `clearCookie()` del `logout()`, con las mismas opciones exactas (si no coinciden, el navegador no reconoce que es la misma cookie y no la borra).

---

## Checklist de verificación post-deploy

- [ ] `GET /api/docs` en el backend carga Swagger
- [ ] Login desde el frontend responde `200` y setea la cookie con dominio del **frontend** (no del backend) — verificar en DevTools → Application → Cookies
- [ ] Navegar a un dashboard protegido sin recargar mantiene la sesión
- [ ] Cerrar sesión y volver a entrar a una ruta protegida redirige a `/login`
- [ ] Las variables usadas en `next.config.ts` están marcadas para el ambiente **Production** en Vercel

# MaletFit Frontend 🏋️‍♂️💪

Frontend desarrollado para la plataforma **MaletFit**, construido con Next.js (App Router), TypeScript y estilizado con Tailwind CSS y componentes de Shadcn UI.

---

## 🚀 Tecnologías y Herramientas

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes:** [Shadcn UI](https://ui.shadcn.com/)
- **Cliente HTTP:** [Axios](https://axios-http.com/)
- **Manejo de Cookies:** `js-cookie`

---

## 📂 Estructura del Proyecto

```text
maletfit-frontend/
├── api/              # Configuración y llamadas a la API
├── app/              # Rutas y páginas (App Router)
│   ├── globals.css   # Estilos globales y tokens de diseño
│   ├── layout.tsx    # Layout principal de la app
│   └── page.tsx      # Página de inicio / pruebas
├── components/       # Componentes reutilizables
│   └── ui/           # Componentes base de Shadcn UI
├── context/          # Context API de React
├── lib/              # Utilidades generales
├── services/         # Capa de servicios y configuración de Axios
└── types/            # Definiciones de tipos e interfaces TypeScript
```

---

## ⚙️ Configuración y Ejecución Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/maletfit-frontend.git
cd maletfit-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Creá un archivo `.env.local` en la raíz del proyecto basándote en el ejemplo:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 🛠️ Capa de Servicios (`services/api.ts`)

El cliente HTTP está configurado de forma centralizada utilizando Axios con:

- **Base URL** obtenida de las variables de entorno.
- **Interceptor de Request:** Inyecta automáticamente el token de autenticación (Bearer) almacenado en las cookies.
- **Interceptor de Response:** Maneja de forma global los errores de autenticación (`401`), eliminando credenciales inválidas y redirigiendo al login.

---

## 👩‍💻 Autora

- **Macarena Aliberti** — _Desarrollo Full Stack_
- **GitHub:** [@MacarenaAliberti-web](https://github.com/MacarenaAliberti-web)
- **LinkedIn:** https://www.linkedin.com/in/macarena-aliberti-440b03373/

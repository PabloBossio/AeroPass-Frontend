# Aerolinea API — Frontend

Frontend en React (con Vite) que consume la API de `aerolinea-api`. Cubre el flujo básico: login, ver vuelos disponibles, reservar, y ver/cancelar mis reservas.

## Cómo correrlo

1. Asegurate de tener tu backend (`aerolinea-api`) corriendo en `http://localhost:8080`.
2. Instalá las dependencias:
   ```
   npm install
   ```
3. Levantá el servidor de desarrollo:
   ```
   npm run dev
   ```
4. Abrí en el navegador la URL que te muestre la consola (por defecto `http://localhost:5173`).

## Estructura del proyecto

- `src/api/` — funciones que llaman a la API (una por recurso: `auth.js`, `vuelos.js`, `reservas.js`), todas usando la misma instancia de `axios` configurada en `client.js` (que agrega el token JWT automáticamente a cada request).
- `src/context/AuthContext.jsx` — guarda quién está logueado (token, email, rol, id) en toda la app, usando el patrón de Context de React. Persiste en `localStorage` para sobrevivir a un refresh de página.
- `src/components/` — piezas reutilizables: `Navbar` (barra de navegación) y `ProtectedRoute` (bloquea el acceso a una página si no hay usuario logueado).
- `src/pages/` — una página por ruta: `LoginPage`, `VuelosPage` (página principal), `MisReservasPage`.
- `src/App.jsx` — define las rutas de la aplicación con `react-router-dom`.

## Variables de entorno

`.env` define `VITE_API_URL`, la URL base de tu API. Si tu backend corre en otro puerto o hostname, cambiala ahí.

## Nota de seguridad

El JWT se guarda en `localStorage` por simplicidad (estándar para un proyecto de aprendizaje). En un proyecto de producción con mayores exigencias de seguridad, se prefiere una cookie `httpOnly` (no accesible desde JavaScript), que protege mejor contra el robo de token vía ataques XSS.

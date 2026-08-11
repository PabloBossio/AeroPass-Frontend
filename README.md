# AeroPass — Frontend

Aplicación web de reservas de vuelos construida con **React**, **Vite** y **Tailwind CSS**, consumiendo una API REST propia desarrollada en Java/Spring Boot y desplegada en producción.

## Demo en vivo

🔗 **https://aero-pass-frontend.vercel.app**

Usuario de prueba (rol Administrador):

- **Email:** admin@example.com
- **Contraseña:** admin12345

También podés registrarte como usuario nuevo desde la propia app para probar el flujo de reservas del lado de un usuario común.

> **Nota:** el backend corre en la capa gratuita de Render, que "duerme" tras 15 minutos sin uso. Si el primer login tarda entre 30 y 50 segundos, es normal — el servidor se está despertando.

## Funcionalidades

- Registro y login con autenticación JWT.
- Búsqueda y reserva de vuelos, y gestión de reservas propias.
- Perfil de usuario con datos reales (nombre, rol, resumen de reservas).
- Modo claro / oscuro.
- Panel de administración completo (solo rol ADMIN):
  - Dashboard con estadísticas (vuelos, aviones, usuarios, reservas, ingresos, ocupación).
  - CRUD de vuelos y aviones.
  - Gestión de roles de usuario.
  - Vista y cancelación de todas las reservas del sistema.

## Stack técnico

- React 18 + Vite
- React Router v6 (rutas anidadas para el panel admin)
- Tailwind CSS (sistema de diseño propio, modo oscuro con estrategia `class`)
- Axios (con interceptor de autenticación)
- Context API para estado de sesión y tema

## Backend

Este frontend consume la API REST de **AeroPass-Backend**:
👉 [github.com/PabloBossio/AeroPass-Backend](https://github.com/PabloBossio/AeroPass-Backend)

Java 21, Spring Boot, Spring Security + JWT, JPA/Hibernate, MySQL, más de 90 tests automatizados (JUnit 5 + Mockito), documentación interactiva con Swagger/OpenAPI, y despliegue containerizado con Docker.

## Correrlo en local

```bash
git clone https://github.com/PabloBossio/AeroPass-Frontend.git
cd AeroPass-Frontend
npm install
npm run dev
```

Necesita una variable de entorno `VITE_API_URL` apuntando a una instancia del backend (local o la de producción).

## Autor

**Pablo Bossio** — [linkedin.com/in/pablo-bossio-909b27420](https://linkedin.com/in/pablo-bossio-909b27420)

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Envuelve una página que requiere estar logueado. Si no hay usuario
// en el contexto, redirige a /login en vez de renderizar la página.
// Con soloAdmin=true, además exige rol ADMIN — un usuario logueado pero
// sin ese rol se redirige a la home en vez de ver la página.
//
// Nota importante: esto es solo una mejora de experiencia del lado del
// cliente (evita el parpadeo de mostrar una página que igual va a fallar
// al pedir datos). La seguridad real la sigue haciendo Spring Security
// del lado del servidor — un usuario que fuerce la URL a mano no puede
// leer ni modificar nada que el backend no le permita.
export default function ProtectedRoute({ children, soloAdmin = false }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (soloAdmin && user.rol !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return children
}

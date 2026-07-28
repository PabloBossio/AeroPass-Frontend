import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Envuelve una página que requiere estar logueado. Si no hay usuario
// en el contexto, redirige a /login en vez de renderizar la página.
export default function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

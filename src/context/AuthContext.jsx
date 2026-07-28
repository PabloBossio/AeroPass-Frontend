import { createContext, useContext, useState } from 'react'
import { login as loginRequest } from '../api/auth'

const AuthContext = createContext(null)

// Guarda el usuario logueado (token + email + rol + id) en localStorage,
// así sobrevive a un refresh de la página. Para un proyecto de aprendizaje
// esto es aceptable; en un proyecto real de mayor exigencia de seguridad
// se suele preferir una cookie httpOnly (no accesible desde JS, protege
// mejor contra ataques XSS que roben el token).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  async function login(email, password) {
    const data = await loginRequest(email, password)
    const usuario = { token: data.token, email: data.email, rol: data.rol, id: data.id }
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(usuario))
    setUser(usuario)
    return usuario
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>')
  }
  return context
}

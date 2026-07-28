import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Aerolinea API</Link>
      <div className="navbar-links">
        <Link to="/">Vuelos</Link>
        {user && <Link to="/mis-reservas">Mis reservas</Link>}
        {user ? (
          <>
            <span className="navbar-user">{user.email} ({user.rol})</span>
            <button onClick={handleLogout}>Salir</button>
          </>
        ) : (
          <Link to="/login">Ingresar</Link>
        )}
      </div>
    </nav>
  )
}

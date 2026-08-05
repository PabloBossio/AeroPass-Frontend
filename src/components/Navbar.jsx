import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Logo from './Logo'
import { MenuIcon, CloseIcon, MoonIcon, SunIcon, UserIcon } from './icons'

const linkBase =
  'text-sm font-medium text-slate-500 hover:text-blue-600 transition dark:text-slate-400 dark:hover:text-blue-400'
const linkActive = 'text-blue-600 dark:text-blue-400'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { oscuro, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  function handleLogout() {
    logout()
    setMenuAbierto(false)
    navigate('/login')
  }

  const links = (
    <>
      <NavLink
        to="/vuelos"
        className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}
        onClick={() => setMenuAbierto(false)}
      >
        Vuelos
      </NavLink>
      {user && (
        <NavLink
          to="/mis-reservas"
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}
          onClick={() => setMenuAbierto(false)}
        >
          Mis reservas
        </NavLink>
      )}
      {user?.rol === 'ADMIN' && (
        <NavLink
          to="/admin"
          className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}
          onClick={() => setMenuAbierto(false)}
        >
          Panel admin
        </NavLink>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-navy-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-8">{links}</nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-amber-400 dark:hover:bg-slate-800"
            title={oscuro ? 'Modo claro' : 'Modo oscuro'}
          >
            {oscuro ? <SunIcon /> : <MoonIcon />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/perfil"
                className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
              >
                <UserIcon className="w-4 h-4" />
                {user.email}
              </Link>
              <button onClick={handleLogout} className="btn-outline !px-4 !py-2 text-sm">
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-outline !px-5 !py-2 text-sm">
                Ingresar
              </Link>
              <Link to="/registro" className="btn-primary !px-5 !py-2 text-sm">
                Crear cuenta
              </Link>
            </div>
          )}
        </div>

        {/* Botón hamburguesa, solo mobile */}
        <button
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300"
          onClick={() => setMenuAbierto((v) => !v)}
        >
          {menuAbierto ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Menú mobile desplegable */}
      {menuAbierto && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-navy-950">
          <nav className="flex flex-col gap-4">{links}</nav>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-300"
            >
              {oscuro ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
              {oscuro ? 'Modo claro' : 'Modo oscuro'}
            </button>
            {user ? (
              <button onClick={handleLogout} className="btn-outline !px-4 !py-1.5 text-sm">
                Salir
              </button>
            ) : (
              <Link
                to="/login"
                className="btn-primary !px-4 !py-1.5 text-sm"
                onClick={() => setMenuAbierto(false)}
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

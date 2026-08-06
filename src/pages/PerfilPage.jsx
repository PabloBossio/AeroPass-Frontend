import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listarMisReservas } from '../api/reservas'
import { obtenerMiPerfil } from '../api/usuarios'
import Badge from '../components/Badge'
import { UserIcon } from '../components/icons'

export default function PerfilPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [totalReservas, setTotalReservas] = useState(null)
  const [reservasActivas, setReservasActivas] = useState(null)
  const [nombre, setNombre] = useState(null)

  useEffect(() => {
    listarMisReservas(user.id)
      .then((data) => {
        setTotalReservas(data.length)
        setReservasActivas(data.filter((r) => r.estado !== 'CANCELADA').length)
      })
      .catch(() => {
        setTotalReservas(0)
        setReservasActivas(0)
      })
  }, [user.id])

  useEffect(() => {
    obtenerMiPerfil()
      .then((data) => setNombre(data.nombre))
      .catch(() => setNombre(null))
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
        Mi perfil
      </h1>

      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {nombre ?? user.email}
            </div>
            {nombre && <div className="text-sm text-slate-400">{user.email}</div>}
            <div className="mt-1">
              <Badge value={user.rol} />
            </div>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              ID de cuenta
            </dt>
            <dd className="mt-1 text-sm text-slate-700 dark:text-slate-200">#{user.id}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Rol</dt>
            <dd className="mt-1 text-sm text-slate-700 dark:text-slate-200">
              {user.rol === 'ADMIN' ? 'Administrador' : 'Usuario'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Reservas totales
            </dt>
            <dd className="mt-1 text-sm text-slate-700 dark:text-slate-200">
              {totalReservas ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Reservas activas
            </dt>
            <dd className="mt-1 text-sm text-slate-700 dark:text-slate-200">
              {reservasActivas ?? '—'}
            </dd>
          </div>
        </dl>

        <button onClick={handleLogout} className="btn-outline mt-8 w-full">
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

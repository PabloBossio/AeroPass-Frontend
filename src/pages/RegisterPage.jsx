import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registrarUsuario } from '../api/usuarios'
import Logo from '../components/Logo'

export default function RegisterPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await registrarUsuario(nombre, email, password)
      navigate('/login', { state: { registrado: true } })
    } catch (err) {
      const status = err.response?.status
      if (status === 400) {
        setError(
          err.response?.data?.mensaje ||
            'No se pudo crear la cuenta: revisá los datos ingresados.'
        )
      } else {
        setError('Ocurrió un error inesperado. Intentá de nuevo.')
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-dots px-6 py-12">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>
        <h1 className="mb-1 text-center font-display text-2xl font-bold text-slate-900 dark:text-white">
          Creá tu cuenta
        </h1>
        <p className="mb-6 text-center text-sm text-slate-400">
          Registrate para empezar a reservar tus vuelos.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Nombre completo
            </span>
            <input
              type="text"
              className="input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Email</span>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Contraseña
            </span>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          )}

          <button type="submit" disabled={cargando} className="btn-primary mt-2 w-full">
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
            Ingresá acá
          </Link>
        </p>
      </div>
    </div>
  )
}

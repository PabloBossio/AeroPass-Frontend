import { useEffect, useState } from 'react'
import { listarMisReservas, cancelarReserva } from '../api/reservas'
import { crearSesionDePago } from '../api/pagos'
import { useAuth } from '../context/AuthContext'
import Badge from '../components/Badge'

function formatearFecha(fechaIso) {
  if (!fechaIso) return '-'
  return new Date(fechaIso).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export default function MisReservasPage() {
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState(null)
  const [cancelandoId, setCancelandoId] = useState(null)
  const [pagandoId, setPagandoId] = useState(null)
  const { user } = useAuth()

  async function cargarReservas() {
    setCargando(true)
    try {
      const data = await listarMisReservas(user.id)
      setReservas(data)
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar tus reservas.' })
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarReservas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCancelar(id) {
    setMensaje(null)
    setCancelandoId(id)
    try {
      await cancelarReserva(id)
      setMensaje({ tipo: 'exito', texto: 'Reserva cancelada correctamente.' })
      cargarReservas()
    } catch (err) {
      const status = err.response?.status
      if (status === 400) {
        setMensaje({ tipo: 'error', texto: 'Esa reserva ya estaba cancelada.' })
      } else if (status === 404) {
        setMensaje({ tipo: 'error', texto: 'La reserva no existe.' })
      } else {
        setMensaje({ tipo: 'error', texto: 'Ocurrió un error al cancelar.' })
      }
    } finally {
      setCancelandoId(null)
    }
  }

  async function handlePagar(id) {
    setMensaje(null)
    setPagandoId(id)
    try {
      const { url } = await crearSesionDePago(id)
      // Redirección completa (no navegación de React Router): el checkout
      // vive en el dominio de Stripe, fuera de la SPA.
      window.location.href = url
    } catch (err) {
      const status = err.response?.status
      if (status === 400) {
        setMensaje({ tipo: 'error', texto: 'Esa reserva ya no está pendiente de pago.' })
      } else if (status === 404) {
        setMensaje({ tipo: 'error', texto: 'La reserva no existe.' })
      } else {
        setMensaje({ tipo: 'error', texto: 'No se pudo iniciar el pago. Probá de nuevo.' })
      }
      setPagandoId(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-1 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
        Mis reservas
      </h1>
      <p className="mb-6 text-slate-400">Todo lo que reservaste, en un solo lugar.</p>

      {mensaje && (
        <p
          className={`mb-6 rounded-xl px-4 py-2.5 text-sm ${
            mensaje.tipo === 'error'
              ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
              : 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300'
          }`}
        >
          {mensaje.texto}
        </p>
      )}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : reservas.length === 0 ? (
        <div className="card p-8 text-center text-slate-400">
          Todavía no hiciste ninguna reserva.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="font-display font-bold text-slate-900 dark:text-white">
                  {reserva.vuelo
                    ? `${reserva.vuelo.origen} → ${reserva.vuelo.destino}`
                    : 'Vuelo no disponible'}
                </div>
                <div className="text-xs text-slate-400">
                  Vuelo: {formatearFecha(reserva.vuelo?.fechaSalida)} · Reservado:{' '}
                  {formatearFecha(reserva.fechaReserva)}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="font-display text-lg font-extrabold text-blue-600 dark:text-blue-400">
                  ${Number(reserva.precioPagado).toFixed(2)}
                </div>
                <Badge value={reserva.estado} />
                {reserva.estado === 'PENDIENTE_PAGO' && (
                  <button
                    onClick={() => handlePagar(reserva.id)}
                    disabled={pagandoId === reserva.id}
                    className="btn-primary !px-4 !py-2 text-sm"
                  >
                    {pagandoId === reserva.id ? 'Redirigiendo...' : 'Pagar'}
                  </button>
                )}
                {reserva.estado !== 'CANCELADA' && (
                  <button
                    onClick={() => handleCancelar(reserva.id)}
                    disabled={cancelandoId === reserva.id}
                    className="btn-outline !px-4 !py-2 text-sm"
                  >
                    {cancelandoId === reserva.id ? 'Cancelando...' : 'Cancelar'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

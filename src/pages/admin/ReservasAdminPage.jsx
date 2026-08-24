import { useEffect, useState } from 'react'
import { listarTodasLasReservas, cancelarReserva } from '../../api/reservas'
import Badge from '../../components/Badge'

function formatearFecha(fechaIso) {
  if (!fechaIso) return '-'
  return new Date(fechaIso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function ReservasAdminPage() {
  const [reservas, setReservas] = useState([])
  const [paginaActual, setPaginaActual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [esUltima, setEsUltima] = useState(true)
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState(null)
  const [cancelandoId, setCancelandoId] = useState(null)

  async function cargarReservas(pagina = 0) {
    setCargando(true)
    try {
      const data = await listarTodasLasReservas({ page: pagina })
      setReservas(data.contenido)
      setPaginaActual(data.paginaActual)
      setTotalPaginas(data.totalPaginas)
      setEsUltima(data.esUltima)
    } catch {
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar las reservas.' })
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarReservas(0)
  }, [])

  function handlePaginaAnterior() {
    if (paginaActual > 0) cargarReservas(paginaActual - 1)
  }

  function handlePaginaSiguiente() {
    if (!esUltima) cargarReservas(paginaActual + 1)
  }

  async function handleCancelar(id) {
    setMensaje(null)
    setCancelandoId(id)
    try {
      await cancelarReserva(id)
      setMensaje({ tipo: 'exito', texto: 'Reserva cancelada correctamente.' })
      cargarReservas(paginaActual)
    } catch (err) {
      const texto =
        err.response?.status === 400
          ? 'Esa reserva ya estaba cancelada.'
          : 'Ocurrió un error al cancelar.'
      setMensaje({ tipo: 'error', texto })
    } finally {
      setCancelandoId(null)
    }
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
        Reservas
      </h1>
      <p className="mb-6 text-sm text-slate-400">Todas las reservas del sistema, de todos los usuarios.</p>

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
        <div className="card p-8 text-center text-slate-400">Todavía no hay reservas.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="font-display font-bold text-slate-900 dark:text-white">
                  {reserva.vuelo ? `${reserva.vuelo.origen} → ${reserva.vuelo.destino}` : '-'}
                </div>
                <div className="text-xs text-slate-400">
                  {reserva.usuario?.email || 'usuario desconocido'} · Reservado:{' '}
                  {formatearFecha(reserva.fechaReserva)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-blue-600 dark:text-blue-400">
                  ${Number(reserva.precioPagado).toFixed(2)}
                </span>
                <Badge value={reserva.estado} />
                {reserva.estado !== 'CANCELADA' && (
                  <button
                    onClick={() => handleCancelar(reserva.id)}
                    disabled={cancelandoId === reserva.id}
                    className="btn-outline !px-4 !py-1.5 text-xs"
                  >
                    {cancelandoId === reserva.id ? 'Cancelando...' : 'Cancelar'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!cargando && totalPaginas > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={handlePaginaAnterior}
            disabled={paginaActual === 0}
            className="btn-outline !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-sm text-slate-400">
            Página {paginaActual + 1} de {totalPaginas}
          </span>
          <button
            onClick={handlePaginaSiguiente}
            disabled={esUltima}
            className="btn-outline !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

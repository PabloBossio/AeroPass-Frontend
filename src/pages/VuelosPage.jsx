import { useEffect, useState } from 'react'
import { listarVuelos } from '../api/vuelos'
import { crearReserva } from '../api/reservas'
import { useAuth } from '../context/AuthContext'
import Badge from '../components/Badge'
import { PlaneIcon } from '../components/icons'

function formatearFecha(fechaIso) {
  if (!fechaIso) return '-'
  return new Date(fechaIso).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

// Acá NO van CANCELADO ni FINALIZADO: esta pantalla es para reservar, y esos
// dos estados ya vienen excluidos directamente por el backend (soloReservables=true
// más abajo) — ofrecerlos como filtro solo confundiría, porque combinados con
// ese flag siempre devolverían una lista vacía.
const OPCIONES_ESTADO = [
  { value: '', label: 'Todos los estados' },
  { value: 'PROGRAMADO', label: 'Programado' },
  { value: 'EN_VUELO', label: 'En vuelo' },
  { value: 'DEMORADO', label: 'Demorado' },
]

export default function VuelosPage() {
  const [vuelos, setVuelos] = useState([])
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [estado, setEstado] = useState('')
  const [paginaActual, setPaginaActual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [totalElementos, setTotalElementos] = useState(0)
  const [esUltima, setEsUltima] = useState(true)
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState(null)
  const [reservandoId, setReservandoId] = useState(null)
  const { user } = useAuth()

  // `filtros` es opcional: por default toma los valores actuales del state
  // (origen/destino/estado). Se puede pasar explícito cuando necesitamos
  // cargar con valores que el state todavía no reflejó (ej. "limpiar
  // filtros", donde el setEstado('') recién se ve reflejado en el próximo
  // render, pero acá ya necesitamos pedir sin filtros).
  async function cargarVuelos(pagina = 0, filtros = { origen, destino, estado }) {
    setCargando(true)
    try {
      const data = await listarVuelos({
        page: pagina,
        origen: filtros.origen || undefined,
        destino: filtros.destino || undefined,
        estado: filtros.estado || undefined,
        // Esta es la pantalla de búsqueda para reservar: nunca debería
        // mostrar (ni permitir seleccionar) un vuelo CANCELADO o FINALIZADO.
        soloReservables: true,
      })
      setVuelos(data.contenido)
      setPaginaActual(data.paginaActual)
      setTotalPaginas(data.totalPaginas)
      setTotalElementos(data.totalElementos)
      setEsUltima(data.esUltima)
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los vuelos.' })
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarVuelos(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleBuscar(e) {
    e.preventDefault()
    cargarVuelos(0)
  }

  function handleLimpiarFiltros() {
    setOrigen('')
    setDestino('')
    setEstado('')
    cargarVuelos(0, { origen: '', destino: '', estado: '' })
  }

  function handlePaginaAnterior() {
    if (paginaActual > 0) cargarVuelos(paginaActual - 1)
  }

  function handlePaginaSiguiente() {
    if (!esUltima) cargarVuelos(paginaActual + 1)
  }

  async function handleReservar(vueloId) {
    if (!user) return
    setMensaje(null)
    setReservandoId(vueloId)
    try {
      await crearReserva(user.id, vueloId)
      setMensaje({ tipo: 'exito', texto: 'Reserva creada correctamente.' })
      cargarVuelos(paginaActual)
    } catch (err) {
      const status = err.response?.status
      if (status === 400) {
        setMensaje({ tipo: 'error', texto: 'No se pudo reservar: datos inválidos.' })
      } else if (status === 404) {
        setMensaje({ tipo: 'error', texto: 'El vuelo ya no existe.' })
      } else {
        setMensaje({ tipo: 'error', texto: 'Ocurrió un error al reservar.' })
      }
    } finally {
      setReservandoId(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-1 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
        Vuelos disponibles
      </h1>
      <p className="mb-6 text-slate-400">Buscá por origen y destino, o mirá todo lo que tenemos.</p>

      <form onSubmit={handleBuscar} className="mb-8 flex flex-wrap gap-3">
        <input
          className="input max-w-[220px]"
          placeholder="Origen"
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
        />
        <input
          className="input max-w-[220px]"
          placeholder="Destino"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        />
        <select
          className="input max-w-[220px]"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          {OPCIONES_ESTADO.map((opcion) => (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary">
          Buscar
        </button>
        {(origen || destino || estado) && (
          <button type="button" onClick={handleLimpiarFiltros} className="btn-outline">
            Limpiar filtros
          </button>
        )}
      </form>

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

      {!cargando && vuelos.length > 0 && (
        <p className="mb-4 text-sm text-slate-400">
          {totalElementos} vuelo{totalElementos === 1 ? '' : 's'} encontrado
          {totalElementos === 1 ? '' : 's'}
        </p>
      )}

      {cargando ? (
        <p className="text-slate-400">Cargando...</p>
      ) : vuelos.length === 0 ? (
        <p className="text-slate-400">No hay vuelos para mostrar.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {vuelos.map((vuelo) => (
            <div
              key={vuelo.id}
              className="card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex flex-1 items-center gap-6">
                <div className="text-center">
                  <div className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {vuelo.origen}
                  </div>
                  <div className="text-xs text-slate-400">{formatearFecha(vuelo.fechaSalida)}</div>
                </div>
                <div className="flex flex-1 items-center px-2">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  <PlaneIcon className="mx-2 w-4 h-4 shrink-0 rotate-90 text-blue-500" />
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="text-center">
                  <div className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {vuelo.destino}
                  </div>
                  <div className="text-xs text-slate-400">{formatearFecha(vuelo.fechaLlegada)}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden text-xs text-slate-400 sm:block">
                  {vuelo.avion ? `${vuelo.avion.modelo} · ${vuelo.avion.matricula}` : '-'}
                </div>
                <Badge value={vuelo.estado} />
                <div className="text-xs text-slate-400">
                  {vuelo.asientosDisponibles} asiento{vuelo.asientosDisponibles === 1 ? '' : 's'}
                </div>
                <div className="font-display text-xl font-extrabold text-blue-600 dark:text-blue-400">
                  ${Number(vuelo.precio).toFixed(2)}
                </div>
                {user && (
                  <button
                    onClick={() => handleReservar(vuelo.id)}
                    disabled={vuelo.asientosDisponibles === 0 || reservandoId === vuelo.id}
                    className="btn-primary !px-5 !py-2 text-sm"
                  >
                    {reservandoId === vuelo.id ? 'Reservando...' : 'Reservar'}
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

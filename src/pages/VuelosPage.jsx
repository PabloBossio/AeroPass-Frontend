import { useEffect, useState } from 'react'
import { listarVuelos, buscarVuelosPorRuta } from '../api/vuelos'
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

export default function VuelosPage() {
  const [vuelos, setVuelos] = useState([])
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState(null)
  const [reservandoId, setReservandoId] = useState(null)
  const { user } = useAuth()

  async function cargarVuelos() {
    setCargando(true)
    try {
      const data = await listarVuelos()
      setVuelos(data)
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los vuelos.' })
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarVuelos()
  }, [])

  async function handleBuscar(e) {
    e.preventDefault()
    if (!origen && !destino) {
      cargarVuelos()
      return
    }
    setCargando(true)
    try {
      const data = await buscarVuelosPorRuta(origen, destino)
      setVuelos(data)
    } catch (err) {
      setMensaje({ tipo: 'error', texto: 'No se pudo buscar por esa ruta.' })
    } finally {
      setCargando(false)
    }
  }

  async function handleReservar(vueloId) {
    if (!user) return
    setMensaje(null)
    setReservandoId(vueloId)
    try {
      await crearReserva(user.id, vueloId)
      setMensaje({ tipo: 'exito', texto: 'Reserva creada correctamente.' })
      cargarVuelos()
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
        <button type="submit" className="btn-primary">
          Buscar
        </button>
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
    </div>
  )
}

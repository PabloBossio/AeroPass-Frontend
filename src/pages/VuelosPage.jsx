import { useEffect, useState } from 'react'
import { listarVuelos, buscarVuelosPorRuta } from '../api/vuelos'
import { crearReserva } from '../api/reservas'
import { useAuth } from '../context/AuthContext'

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
    }
  }

  return (
    <div className="page page-vuelos">
      <h1>Vuelos disponibles</h1>

      <form className="filtro" onSubmit={handleBuscar}>
        <input
          placeholder="Origen"
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
        />
        <input
          placeholder="Destino"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {mensaje && <p className={mensaje.tipo}>{mensaje.texto}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : vuelos.length === 0 ? (
        <p>No hay vuelos para mostrar.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Origen</th>
              <th>Destino</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Precio</th>
              <th>Asientos</th>
              <th>Estado</th>
              <th>Avión</th>
              {user && <th></th>}
            </tr>
          </thead>
          <tbody>
            {vuelos.map((vuelo) => (
              <tr key={vuelo.id}>
                <td>{vuelo.origen}</td>
                <td>{vuelo.destino}</td>
                <td>{formatearFecha(vuelo.fechaSalida)}</td>
                <td>{formatearFecha(vuelo.fechaLlegada)}</td>
                <td>${Number(vuelo.precio).toFixed(2)}</td>
                <td>{vuelo.asientosDisponibles}</td>
                <td>{vuelo.estado}</td>
                <td>{vuelo.avion ? `${vuelo.avion.modelo} (${vuelo.avion.matricula})` : '-'}</td>
                {user && (
                  <td>
                    <button
                      onClick={() => handleReservar(vuelo.id)}
                      disabled={vuelo.asientosDisponibles === 0}
                    >
                      Reservar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

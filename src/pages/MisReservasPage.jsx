import { useEffect, useState } from 'react'
import { listarMisReservas, cancelarReserva } from '../api/reservas'
import { useAuth } from '../context/AuthContext'

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
    }
  }

  return (
    <div className="page page-reservas">
      <h1>Mis reservas</h1>

      {mensaje && <p className={mensaje.tipo}>{mensaje.texto}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : reservas.length === 0 ? (
        <p>Todavía no hiciste ninguna reserva.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Vuelo</th>
              <th>Fecha de reserva</th>
              <th>Precio pagado</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>
                  {reserva.vuelo
                    ? `${reserva.vuelo.origen} → ${reserva.vuelo.destino} (${formatearFecha(reserva.vuelo.fechaSalida)})`
                    : '-'}
                </td>
                <td>{formatearFecha(reserva.fechaReserva)}</td>
                <td>${Number(reserva.precioPagado).toFixed(2)}</td>
                <td>{reserva.estado}</td>
                <td>
                  {/* Asumo que el enum EstadoReserva usa "CANCELADA" como valor.
                      Si el nombre real es distinto, avisame para ajustarlo. */}
                  {reserva.estado !== 'CANCELADA' && (
                    <button onClick={() => handleCancelar(reserva.id)}>Cancelar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { listarVuelos, crearVuelo, editarVuelo, eliminarVuelo, cambiarEstadoVuelo } from '../../api/vuelos'
import { listarAviones } from '../../api/aviones'
import Badge, { ETIQUETAS } from '../../components/Badge'
import Modal from '../../components/Modal'
import { PlusIcon, PencilIcon, TrashIcon, RefreshIcon } from '../../components/icons'

// Mismo orden que el ciclo de vida real de un vuelo (ver EstadoVuelo en el
// backend): PROGRAMADO -> EN_VUELO -> FINALIZADO, con DEMORADO/CANCELADO
// como alternativas en cualquier punto antes de FINALIZADO.
const ESTADOS_VUELO = ['PROGRAMADO', 'DEMORADO', 'EN_VUELO', 'CANCELADO', 'FINALIZADO']

// DEMORADO y CANCELADO son los dos únicos estados que disparan un email al
// backend, avisando a todos los usuarios con reservas activas sobre el
// vuelo — se lo mostramos al admin antes de que confirme, para que sepa que
// la acción tiene un efecto real más allá de actualizar un campo.
const ESTADOS_QUE_NOTIFICAN = new Set(['DEMORADO', 'CANCELADO'])

function CambiarEstadoModal({ vuelo, onClose, onCambiado }) {
  const [nuevoEstado, setNuevoEstado] = useState(vuelo.estado)
  const [cambiando, setCambiando] = useState(false)
  const [error, setError] = useState(null)

  const sinCambios = nuevoEstado === vuelo.estado

  async function handleConfirmar() {
    setError(null)
    setCambiando(true)
    try {
      await cambiarEstadoVuelo(vuelo.id, nuevoEstado)
      onCambiado(nuevoEstado)
    } catch {
      setError('No se pudo cambiar el estado del vuelo.')
    } finally {
      setCambiando(false)
    }
  }

  return (
    <Modal titulo="Cambiar estado del vuelo" onClose={onClose}>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        Vuelo <strong>{vuelo.origen} → {vuelo.destino}</strong> — estado actual:{' '}
        <Badge value={vuelo.estado} />
      </p>

      <label className="mb-4 flex flex-col gap-1.5">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Nuevo estado</span>
        <select
          className="input"
          value={nuevoEstado}
          onChange={(e) => setNuevoEstado(e.target.value)}
        >
          {ESTADOS_VUELO.map((estado) => (
            <option key={estado} value={estado}>
              {ETIQUETAS[estado] || estado}
            </option>
          ))}
        </select>
      </label>

      {ESTADOS_QUE_NOTIFICAN.has(nuevoEstado) && !sinCambios && (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          Al confirmar, se les va a enviar un email a todos los usuarios con reservas activas
          sobre este vuelo, avisándoles del cambio.
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button onClick={onClose} className="btn-outline flex-1" disabled={cambiando}>
          Cancelar
        </button>
        <button
          onClick={handleConfirmar}
          disabled={cambiando || sinCambios}
          className="btn-primary flex-1"
        >
          {cambiando ? 'Guardando...' : 'Confirmar cambio'}
        </button>
      </div>
    </Modal>
  )
}

function formatearFecha(fechaIso) {
  if (!fechaIso) return '-'
  return new Date(fechaIso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

// Convierte un ISO completo (con o sin "Z"/segundos) al formato que
// espera un <input type="datetime-local"> ("YYYY-MM-DDTHH:mm").
function aInputDatetime(fechaIso) {
  if (!fechaIso) return ''
  return fechaIso.slice(0, 16)
}

const VUELO_VACIO = {
  origen: '',
  destino: '',
  fechaSalida: '',
  fechaLlegada: '',
  precio: '',
  asientosDisponibles: '',
  avionId: '',
}

function VueloFormModal({ vuelo, aviones, onClose, onGuardado }) {
  const esEdicion = Boolean(vuelo)
  const [form, setForm] = useState(
    vuelo
      ? {
          origen: vuelo.origen,
          destino: vuelo.destino,
          fechaSalida: aInputDatetime(vuelo.fechaSalida),
          fechaLlegada: aInputDatetime(vuelo.fechaLlegada),
          precio: vuelo.precio,
          asientosDisponibles: vuelo.asientosDisponibles,
          avionId: vuelo.avion?.id || '',
        }
      : VUELO_VACIO
  )
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  function actualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setGuardando(true)
    const payload = {
      origen: form.origen,
      destino: form.destino,
      fechaSalida: form.fechaSalida.length === 16 ? `${form.fechaSalida}:00` : form.fechaSalida,
      fechaLlegada: form.fechaLlegada.length === 16 ? `${form.fechaLlegada}:00` : form.fechaLlegada,
      precio: Number(form.precio),
      asientosDisponibles: Number(form.asientosDisponibles),
      avionId: Number(form.avionId),
    }
    try {
      if (esEdicion) {
        await editarVuelo(vuelo.id, payload)
      } else {
        await crearVuelo(payload)
      }
      onGuardado()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo guardar el vuelo. Revisá los datos.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal titulo={esEdicion ? 'Editar vuelo' : 'Crear vuelo'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Origen</span>
            <input
              className="input"
              value={form.origen}
              onChange={(e) => actualizarCampo('origen', e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Destino</span>
            <input
              className="input"
              value={form.destino}
              onChange={(e) => actualizarCampo('destino', e.target.value)}
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Fecha y hora de salida
            </span>
            <input
              type="datetime-local"
              className="input"
              value={form.fechaSalida}
              onChange={(e) => actualizarCampo('fechaSalida', e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Fecha y hora de llegada
            </span>
            <input
              type="datetime-local"
              className="input"
              value={form.fechaLlegada}
              onChange={(e) => actualizarCampo('fechaLlegada', e.target.value)}
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Precio (USD)
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="input"
              value={form.precio}
              onChange={(e) => actualizarCampo('precio', e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Asientos disponibles
            </span>
            <input
              type="number"
              min="1"
              className="input"
              value={form.asientosDisponibles}
              onChange={(e) => actualizarCampo('asientosDisponibles', e.target.value)}
              required
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Avión</span>
          <select
            className="input"
            value={form.avionId}
            onChange={(e) => actualizarCampo('avionId', e.target.value)}
            required
          >
            <option value="" disabled>
              Elegí un avión...
            </option>
            {aviones.map((avion) => (
              <option key={avion.id} value={avion.id}>
                {avion.modelo} · {avion.matricula} ({avion.capacidad} asientos)
              </option>
            ))}
          </select>
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={guardando} className="btn-primary mt-2 w-full">
          {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear vuelo'}
        </button>
      </form>
    </Modal>
  )
}

export default function VuelosAdminPage() {
  const [vuelos, setVuelos] = useState([])
  const [aviones, setAviones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState(null)
  const [modal, setModal] = useState(null) // null | { mode: 'crear' } | { mode: 'editar', vuelo }
  const [vueloAEliminar, setVueloAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const [vueloCambiarEstado, setVueloCambiarEstado] = useState(null)

  async function cargarTodo() {
    setCargando(true)
    try {
      // GET /api/vuelos ahora pagina (10 por página por default). Para el
      // panel de admin queremos ver todos los vuelos en una sola tabla, así
      // que pedimos una página grande en vez de armar paginación acá
      // también. No es la solución "ideal" (lo correcto sería un endpoint
      // de agregación aparte), pero resuelve el caso real sin duplicar la
      // UI de paginación en dos lugares. Documentado en NOTAS.md.
      const [vuelosData, avionesData] = await Promise.all([
        listarVuelos({ size: 1000 }),
        listarAviones(),
      ])
      setVuelos(vuelosData.contenido)
      setAviones(avionesData)
    } catch {
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los vuelos.' })
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarTodo()
  }, [])

  function handleGuardado() {
    setModal(null)
    setMensaje({ tipo: 'exito', texto: 'Vuelo guardado correctamente.' })
    cargarTodo()
  }

  function handleEstadoCambiado() {
    setVueloCambiarEstado(null)
    setMensaje({ tipo: 'exito', texto: 'Estado del vuelo actualizado correctamente.' })
    cargarTodo()
  }

  async function handleEliminar() {
    setEliminando(true)
    try {
      await eliminarVuelo(vueloAEliminar.id)
      setMensaje({ tipo: 'exito', texto: 'Vuelo eliminado correctamente.' })
      setVueloAEliminar(null)
      cargarTodo()
    } catch (err) {
      const texto =
        err.response?.status === 400
          ? 'No se puede eliminar: el vuelo tiene reservas asociadas.'
          : 'No se pudo eliminar el vuelo.'
      setMensaje({ tipo: 'error', texto })
      setVueloAEliminar(null)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
            Vuelos
          </h1>
          <p className="text-sm text-slate-400">Crear, editar y eliminar vuelos.</p>
        </div>
        <button onClick={() => setModal({ mode: 'crear' })} className="btn-primary !px-5 !py-2.5 text-sm">
          <PlusIcon />
          Nuevo vuelo
        </button>
      </div>

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
      ) : (
        <div className="flex flex-col gap-3">
          {vuelos.map((vuelo) => (
            <div
              key={vuelo.id}
              className="card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="font-display font-bold text-slate-900 dark:text-white">
                  {vuelo.origen} → {vuelo.destino}
                </div>
                <div className="text-xs text-slate-400">
                  {formatearFecha(vuelo.fechaSalida)} · {vuelo.avion?.modelo || 'sin avión'} ·{' '}
                  {vuelo.asientosDisponibles} asientos
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge value={vuelo.estado} />
                <span className="font-display font-bold text-blue-600 dark:text-blue-400">
                  ${Number(vuelo.precio).toFixed(2)}
                </span>
                <button
                  onClick={() => setVueloCambiarEstado(vuelo)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                  title="Cambiar estado"
                >
                  <RefreshIcon />
                </button>
                <button
                  onClick={() => setModal({ mode: 'editar', vuelo })}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                  title="Editar"
                >
                  <PencilIcon />
                </button>
                <button
                  onClick={() => setVueloAEliminar(vuelo)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                  title="Eliminar"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <VueloFormModal
          vuelo={modal.mode === 'editar' ? modal.vuelo : null}
          aviones={aviones}
          onClose={() => setModal(null)}
          onGuardado={handleGuardado}
        />
      )}

      {vueloCambiarEstado && (
        <CambiarEstadoModal
          vuelo={vueloCambiarEstado}
          onClose={() => setVueloCambiarEstado(null)}
          onCambiado={handleEstadoCambiado}
        />
      )}

      {vueloAEliminar && (
        <Modal titulo="Eliminar vuelo" onClose={() => setVueloAEliminar(null)}>
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
            ¿Seguro que querés eliminar el vuelo{' '}
            <strong>
              {vueloAEliminar.origen} → {vueloAEliminar.destino}
            </strong>
            ? Esta acción no se puede deshacer. Si tiene reservas asociadas, no se va a poder
            eliminar.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setVueloAEliminar(null)}
              className="btn-outline flex-1"
              disabled={eliminando}
            >
              Cancelar
            </button>
            <button
              onClick={handleEliminar}
              disabled={eliminando}
              className="flex-1 rounded-full bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 disabled:bg-slate-300"
            >
              {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

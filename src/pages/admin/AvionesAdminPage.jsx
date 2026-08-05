import { useEffect, useState } from 'react'
import { listarAviones, crearAvion, editarAvion } from '../../api/aviones'
import Modal from '../../components/Modal'
import { PlusIcon, PencilIcon, LayersIcon } from '../../components/icons'

const AVION_VACIO = { modelo: '', matricula: '', capacidad: '', aerolinea: '' }

function AvionFormModal({ avion, onClose, onGuardado }) {
  const esEdicion = Boolean(avion)
  const [form, setForm] = useState(avion ? { ...avion } : AVION_VACIO)
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
      modelo: form.modelo,
      matricula: form.matricula,
      capacidad: Number(form.capacidad),
      aerolinea: form.aerolinea,
    }
    try {
      if (esEdicion) {
        await editarAvion(avion.id, payload)
      } else {
        await crearAvion(payload)
      }
      onGuardado()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo guardar el avión. Revisá los datos.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal titulo={esEdicion ? 'Editar avión' : 'Crear avión'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Modelo</span>
          <input
            className="input"
            value={form.modelo}
            onChange={(e) => actualizarCampo('modelo', e.target.value)}
            placeholder="Boeing 737"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Matrícula</span>
          <input
            className="input"
            value={form.matricula}
            onChange={(e) => actualizarCampo('matricula', e.target.value)}
            placeholder="ABC123"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Capacidad (asientos)
          </span>
          <input
            type="number"
            min="1"
            className="input"
            value={form.capacidad}
            onChange={(e) => actualizarCampo('capacidad', e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Aerolínea</span>
          <input
            className="input"
            value={form.aerolinea}
            onChange={(e) => actualizarCampo('aerolinea', e.target.value)}
            placeholder="Aerolineas Argentinas"
            required
          />
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={guardando} className="btn-primary mt-2 w-full">
          {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear avión'}
        </button>
      </form>
    </Modal>
  )
}

export default function AvionesAdminPage() {
  const [aviones, setAviones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState(null)
  const [modal, setModal] = useState(null)

  async function cargarAviones() {
    setCargando(true)
    try {
      const data = await listarAviones()
      setAviones(data)
    } catch {
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los aviones.' })
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarAviones()
  }, [])

  function handleGuardado() {
    setModal(null)
    setMensaje({ tipo: 'exito', texto: 'Avión guardado correctamente.' })
    cargarAviones()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
            Aviones
          </h1>
          <p className="text-sm text-slate-400">Crear y editar los aviones de la flota.</p>
        </div>
        <button onClick={() => setModal({ mode: 'crear' })} className="btn-primary !px-5 !py-2.5 text-sm">
          <PlusIcon />
          Nuevo avión
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {aviones.map((avion) => (
            <div key={avion.id} className="card flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <LayersIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-slate-900 dark:text-white">
                    {avion.modelo}
                  </div>
                  <div className="text-xs text-slate-400">
                    {avion.matricula} · {avion.capacidad} asientos · {avion.aerolinea}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setModal({ mode: 'editar', avion })}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                title="Editar"
              >
                <PencilIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <AvionFormModal
          avion={modal.mode === 'editar' ? modal.avion : null}
          onClose={() => setModal(null)}
          onGuardado={handleGuardado}
        />
      )}
    </div>
  )
}

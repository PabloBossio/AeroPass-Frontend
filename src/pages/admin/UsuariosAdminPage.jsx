import { useEffect, useState } from 'react'
import { listarUsuarios, actualizarRolUsuario } from '../../api/usuarios'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import { UserIcon } from '../../components/icons'

export default function UsuariosAdminPage() {
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [paginaActual, setPaginaActual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [esUltima, setEsUltima] = useState(true)
  const [cargando, setCargando] = useState(true)
  const [mensaje, setMensaje] = useState(null)
  const [usuarioACambiar, setUsuarioACambiar] = useState(null) // { usuario, nuevoRol }
  const [guardando, setGuardando] = useState(false)

  async function cargarUsuarios(pagina = 0) {
    setCargando(true)
    try {
      const data = await listarUsuarios({ page: pagina })
      setUsuarios(data.contenido)
      setPaginaActual(data.paginaActual)
      setTotalPaginas(data.totalPaginas)
      setEsUltima(data.esUltima)
    } catch {
      setMensaje({ tipo: 'error', texto: 'No se pudieron cargar los usuarios.' })
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarUsuarios(0)
  }, [])

  function handlePaginaAnterior() {
    if (paginaActual > 0) cargarUsuarios(paginaActual - 1)
  }

  function handlePaginaSiguiente() {
    if (!esUltima) cargarUsuarios(paginaActual + 1)
  }

  function pedirCambioDeRol(usuario) {
    const nuevoRol = usuario.rol === 'ADMIN' ? 'USUARIO' : 'ADMIN'
    setUsuarioACambiar({ usuario, nuevoRol })
  }

  async function confirmarCambioDeRol() {
    setGuardando(true)
    try {
      await actualizarRolUsuario(usuarioACambiar.usuario.id, usuarioACambiar.nuevoRol)
      setMensaje({ tipo: 'exito', texto: 'Rol actualizado correctamente.' })
      setUsuarioACambiar(null)
      cargarUsuarios(paginaActual)
    } catch {
      setMensaje({ tipo: 'error', texto: 'No se pudo actualizar el rol.' })
      setUsuarioACambiar(null)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
        Usuarios
      </h1>
      <p className="mb-6 text-sm text-slate-400">
        Promové usuarios a administrador, o quitales el rol si hace falta.
      </p>

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
          {usuarios.map((u) => (
            <div key={u.id} className="card flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">{u.nombre || u.email}</div>
                  <div className="text-xs text-slate-400">{u.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge value={u.rol} />
                <button
                  onClick={() => pedirCambioDeRol(u)}
                  className="btn-outline !px-4 !py-1.5 text-xs"
                >
                  {u.rol === 'ADMIN' ? 'Quitar admin' : 'Hacer admin'}
                </button>
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

      {usuarioACambiar && (
        <Modal titulo="Cambiar rol" onClose={() => setUsuarioACambiar(null)}>
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
            ¿Seguro que querés cambiar el rol de{' '}
            <strong>{usuarioACambiar.usuario.email}</strong> a{' '}
            <strong>{usuarioACambiar.nuevoRol === 'ADMIN' ? 'ADMIN' : 'USUARIO'}</strong>?
            {usuarioACambiar.usuario.id === user.id && usuarioACambiar.nuevoRol === 'USUARIO' && (
              <span className="mt-2 block rounded-xl bg-amber-50 px-3 py-2 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                Ojo: es tu propia cuenta. Si te sacás el rol ADMIN vas a perder acceso a este panel.
              </span>
            )}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setUsuarioACambiar(null)}
              className="btn-outline flex-1"
              disabled={guardando}
            >
              Cancelar
            </button>
            <button onClick={confirmarCambioDeRol} disabled={guardando} className="btn-primary flex-1">
              {guardando ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { listarVuelos } from '../../api/vuelos'
import { listarAviones } from '../../api/aviones'
import { listarUsuarios } from '../../api/usuarios'
import { listarTodasLasReservas } from '../../api/reservas'
import StatCard from '../../components/StatCard'
import BarList from '../../components/BarList'
import { PlaneIcon, LayersIcon, UsersIcon, ClipboardIcon } from '../../components/icons'

const COLOR_ESTADO_VUELO = {
  PROGRAMADO: 'bg-blue-500',
  EN_VUELO: 'bg-amber-500',
  FINALIZADO: 'bg-slate-400',
  DEMORADO: 'bg-amber-500',
  CANCELADO: 'bg-red-500',
}

const COLOR_ESTADO_RESERVA = {
  CONFIRMADA: 'bg-green-500',
  CANCELADA: 'bg-red-500',
}

function agruparPorEstado(items, mapaColores) {
  const conteo = {}
  for (const item of items) {
    conteo[item.estado] = (conteo[item.estado] || 0) + 1
  }
  return Object.entries(conteo).map(([estado, value]) => ({
    label: estado,
    value,
    colorClass: mapaColores[estado],
  }))
}

export default function DashboardPage() {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Mismo criterio que en VuelosAdminPage: GET /api/vuelos pagina, y acá
    // necesitamos el total para calcular estadísticas agregadas, así que
    // pedimos una página grande en vez de sumar paginación al dashboard.
    Promise.all([
      listarVuelos({ size: 1000 }),
      listarAviones(),
      listarUsuarios(),
      listarTodasLasReservas(),
    ])
      .then(([vuelosData, aviones, usuarios, reservas]) => {
        setDatos({ vuelos: vuelosData.contenido, aviones, usuarios, reservas })
      })
      .catch(() => setError('No se pudieron cargar las estadísticas.'))
  }, [])

  if (error) {
    return <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
  }

  if (!datos) {
    return <p className="text-slate-400">Cargando estadísticas...</p>
  }

  const { vuelos, aviones, usuarios, reservas } = datos

  const totalAdmins = usuarios.filter((u) => u.rol === 'ADMIN').length
  const ingresosConfirmados = reservas
    .filter((r) => r.estado === 'CONFIRMADA')
    .reduce((acc, r) => acc + Number(r.precioPagado || 0), 0)

  const vuelosConAvion = vuelos.filter((v) => v.avion?.capacidad)
  const ocupacionPromedio =
    vuelosConAvion.length === 0
      ? 0
      : Math.round(
          (vuelosConAvion.reduce(
            (acc, v) => acc + (v.avion.capacidad - v.asientosDisponibles) / v.avion.capacidad,
            0
          ) /
            vuelosConAvion.length) *
            100
        )

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
        Dashboard
      </h1>
      <p className="mb-6 text-slate-400">Un vistazo general del estado de AeroPass.</p>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={PlaneIcon} label="Vuelos totales" value={vuelos.length} />
        <StatCard icon={LayersIcon} label="Aviones en flota" value={aviones.length} />
        <StatCard
          icon={UsersIcon}
          label="Usuarios registrados"
          value={usuarios.length}
          sub={`${totalAdmins} administrador${totalAdmins === 1 ? '' : 'es'}`}
        />
        <StatCard icon={ClipboardIcon} label="Reservas totales" value={reservas.length} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card p-5">
          <div className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">
            Vuelos por estado
          </div>
          <BarList items={agruparPorEstado(vuelos, COLOR_ESTADO_VUELO)} />
        </div>
        <div className="card p-5">
          <div className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">
            Reservas por estado
          </div>
          <BarList items={agruparPorEstado(reservas, COLOR_ESTADO_RESERVA)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Ingresos confirmados
          </div>
          <div className="mt-2 font-display text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            ${ingresosConfirmados.toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-slate-400">Suma de reservas con estado CONFIRMADA</div>
        </div>
        <div className="card p-5">
          <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Ocupación promedio
          </div>
          <div className="mt-2 font-display text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {ocupacionPromedio}%
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Asientos ocupados sobre capacidad total, promediado entre vuelos con avión asignado
          </div>
        </div>
      </div>
    </div>
  )
}

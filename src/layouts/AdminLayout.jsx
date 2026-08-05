import { NavLink, Outlet } from 'react-router-dom'
import { ChartIcon, PlaneIcon, LayersIcon, UsersIcon, ClipboardIcon } from '../components/icons'

const ITEMS = [
  { to: '/admin', end: true, icon: ChartIcon, label: 'Dashboard' },
  { to: '/admin/vuelos', icon: PlaneIcon, label: 'Vuelos' },
  { to: '/admin/aviones', icon: LayersIcon, label: 'Aviones' },
  { to: '/admin/usuarios', icon: UsersIcon, label: 'Usuarios' },
  { to: '/admin/reservas', icon: ClipboardIcon, label: 'Reservas' },
]

export default function AdminLayout() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 md:flex-row">
      <aside className="shrink-0 md:w-56">
        <div className="mb-4 px-2 text-xs font-bold uppercase tracking-wide text-slate-400">
          Panel admin
        </div>
        <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {ITEMS.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                    : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}

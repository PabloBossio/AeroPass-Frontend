import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BoltIcon, ShieldIcon, ChartIcon, PlaneIcon } from '../components/icons'

const FEATURES = [
  {
    icon: BoltIcon,
    titulo: 'Reserva instantánea',
    desc: 'Confirmá tu vuelo en segundos, sin trámites de más.',
  },
  {
    icon: ShieldIcon,
    titulo: 'Todo bajo control',
    desc: 'Gestioná y cancelá tus reservas cuando quieras.',
  },
  {
    icon: ChartIcon,
    titulo: 'Panel para aerolíneas',
    desc: 'Administración completa de vuelos, aviones y usuarios.',
  },
]

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dots">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="badge badge-blue mb-5">✦ Simple y directo</span>
            <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight text-slate-900 dark:text-white md:text-5xl">
              Reservar tu vuelo nunca fue tan fácil.
            </h1>
            <p className="mb-8 max-w-md text-lg text-slate-500 dark:text-slate-400">
              Comparás precios, elegís tu vuelo y gestionás todo desde un solo
              lugar, sin vueltas.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/vuelos" className="btn-primary">
                Buscar vuelos
              </Link>
              {!user && (
                <Link to="/registro" className="btn-outline">
                  Crear cuenta
                </Link>
              )}
            </div>
          </div>

          <div className="card p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="mb-4 flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Vuelo destacado
              </span>
              <span className="badge badge-green">Programado</span>
            </div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                  EZE
                </div>
                <div className="text-xs text-slate-400">Buenos Aires</div>
              </div>
              <div className="flex flex-1 items-center px-4">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                <PlaneIcon className="mx-2 w-4 h-4 text-blue-500 rotate-90" />
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                  MAD
                </div>
                <div className="text-xs text-slate-400">Madrid</div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
              <span className="text-slate-400">Desde</span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                $850.00
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, titulo, desc }) => (
            <div key={titulo} className="card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Icon />
              </div>
              <div className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
                {titulo}
              </div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

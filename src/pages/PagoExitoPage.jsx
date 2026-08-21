import { Link, useSearchParams } from 'react-router-dom'
import { ShieldCheckIcon } from '../components/icons'

// Página a la que Stripe redirige al navegador después de un pago exitoso
// (success_url de la Checkout Session). Es solo la experiencia visual: la
// confirmación real de la reserva ya la hizo (o está por hacer, en el
// margen de unos segundos) el webhook server-to-server, no este redirect
// del cliente — por eso el mensaje no afirma "tu reserva está confirmada"
// de forma tajante, sino que guía a revisar el estado en Mis reservas.
export default function PagoExitoPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-10 text-center">
      <div className="card w-full p-8">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
          <ShieldCheckIcon className="h-8 w-8" />
        </div>

        <h1 className="mb-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
          ¡Pago realizado con éxito!
        </h1>
        <p className="mb-6 text-slate-400">
          Estamos confirmando tu reserva. En unos segundos debería figurar como{' '}
          <span className="font-semibold text-slate-600 dark:text-slate-300">Confirmada</span> en
          tu lista de reservas.
        </p>

        {sessionId && (
          <p className="mb-6 break-all text-xs text-slate-300 dark:text-slate-600">
            Referencia de pago: {sessionId}
          </p>
        )}

        <Link to="/mis-reservas" className="btn-primary w-full">
          Ver mis reservas
        </Link>
      </div>
    </div>
  )
}

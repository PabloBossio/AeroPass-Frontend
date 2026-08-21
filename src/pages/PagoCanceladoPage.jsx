import { Link } from 'react-router-dom'
import { CloseIcon } from '../components/icons'

// Página a la que Stripe redirige si el usuario abandona el Checkout sin
// pagar (cancel_url). La reserva sigue existiendo en PENDIENTE_PAGO —
// nada se canceló del lado del backend, el usuario solo puede reintentar
// el pago (o cancelar la reserva) desde Mis reservas.
export default function PagoCanceladoPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-10 text-center">
      <div className="card w-full p-8">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
          <CloseIcon className="h-8 w-8" />
        </div>

        <h1 className="mb-2 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
          Pago cancelado
        </h1>
        <p className="mb-6 text-slate-400">
          No se completó el pago y no se te cobró nada. Tu reserva sigue guardada como
          pendiente de pago — podés volver a intentarlo cuando quieras.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/mis-reservas" className="btn-primary w-full">
            Ir a mis reservas
          </Link>
          <Link to="/vuelos" className="btn-outline w-full">
            Volver a vuelos
          </Link>
        </div>
      </div>
    </div>
  )
}

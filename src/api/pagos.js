import apiClient from './client'

// Crea la Checkout Session en Stripe para una reserva PENDIENTE_PAGO y
// devuelve la URL hospedada por Stripe a la que hay que redirigir al
// usuario para completar el pago.
export function crearSesionDePago(reservaId) {
  return apiClient
    .post(`/api/reservas/${reservaId}/pago`)
    .then((res) => res.data)
}

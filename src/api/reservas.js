import apiClient from './client'

export function crearReserva(usuarioId, vueloId) {
  return apiClient
    .post('/api/reservas', { usuarioId, vueloId })
    .then((res) => res.data)
}

export function listarMisReservas(usuarioId) {
  return apiClient
    .get(`/api/reservas/usuario/${usuarioId}`)
    .then((res) => res.data)
}

export function cancelarReserva(id) {
  return apiClient
    .put(`/api/reservas/${id}/cancelar`)
    .then((res) => res.data)
}

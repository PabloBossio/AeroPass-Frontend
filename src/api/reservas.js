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

// Solo ADMIN: todas las reservas del sistema, de todos los usuarios.
// El backend ahora pagina GET /api/reservas (?page, ?size, ?sort). La
// respuesta ya no es un array plano sino
// { contenido, paginaActual, tamanoPagina, totalElementos, totalPaginas, esUltima }.
export function listarTodasLasReservas({ page = 0, size = 10 } = {}) {
  return apiClient.get('/api/reservas', { params: { page, size } }).then((res) => res.data)
}

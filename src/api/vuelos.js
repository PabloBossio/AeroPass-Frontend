import apiClient from './client'

// El backend ahora pagina y filtra GET /api/vuelos (?page, ?size, ?sort,
// ?origen, ?destino, ?estado). La respuesta ya no es un array plano sino
// { contenido, paginaActual, tamanoPagina, totalElementos, totalPaginas, esUltima }.
// Los filtros que queden en `undefined` no se mandan (axios los omite solos).
export function listarVuelos({ page = 0, size = 10, sort = 'fechaSalida', origen, destino, estado } = {}) {
  return apiClient
    .get('/api/vuelos', { params: { page, size, sort, origen, destino, estado } })
    .then((res) => res.data)
}

export function buscarVueloPorId(id) {
  return apiClient.get(`/api/vuelos/${id}`).then((res) => res.data)
}

export function crearVuelo(vuelo) {
  return apiClient.post('/api/vuelos', vuelo).then((res) => res.data)
}

export function editarVuelo(id, vuelo) {
  return apiClient.put(`/api/vuelos/${id}`, vuelo).then((res) => res.data)
}

export function eliminarVuelo(id) {
  return apiClient.delete(`/api/vuelos/${id}`).then((res) => res.data)
}

// Endpoint dedicado para el cambio de estado (distinto de editarVuelo, que
// no toca ese campo). Si el nuevo estado es DEMORADO o CANCELADO, el backend
// notifica por email a los usuarios con reservas activas sobre ese vuelo.
export function cambiarEstadoVuelo(id, estado) {
  return apiClient.put(`/api/vuelos/${id}/estado`, { estado }).then((res) => res.data)
}

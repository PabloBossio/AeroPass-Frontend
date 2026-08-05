import apiClient from './client'

export function listarVuelos() {
  return apiClient.get('/api/vuelos').then((res) => res.data)
}

export function buscarVuelosPorRuta(origen, destino) {
  return apiClient
    .get('/api/vuelos/buscar', { params: { origen, destino } })
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

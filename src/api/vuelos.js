import apiClient from './client'

export function listarVuelos() {
  return apiClient.get('/api/vuelos').then((res) => res.data)
}

export function buscarVuelosPorRuta(origen, destino) {
  return apiClient
    .get('/api/vuelos/buscar', { params: { origen, destino } })
    .then((res) => res.data)
}

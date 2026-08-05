import apiClient from './client'

export function listarAviones() {
  return apiClient.get('/api/aviones').then((res) => res.data)
}

export function buscarAvionPorId(id) {
  return apiClient.get(`/api/aviones/${id}`).then((res) => res.data)
}

export function crearAvion(avion) {
  return apiClient.post('/api/aviones', avion).then((res) => res.data)
}

export function editarAvion(id, avion) {
  return apiClient.put(`/api/aviones/${id}`, avion).then((res) => res.data)
}

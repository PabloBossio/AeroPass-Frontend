import apiClient from './client'

export function registrarUsuario(nombre, email, password) {
  return apiClient
    .post('/api/usuarios', { nombre, email, password })
    .then((res) => res.data)
}

export function obtenerMiPerfil() {
  return apiClient.get('/api/usuarios/me').then((res) => res.data)
}

export function listarUsuarios() {
  return apiClient.get('/api/usuarios').then((res) => res.data)
}

export function buscarUsuarioPorId(id) {
  return apiClient.get(`/api/usuarios/${id}`).then((res) => res.data)
}

export function actualizarRolUsuario(id, rol) {
  return apiClient
    .put(`/api/usuarios/${id}/rol`, { rol })
    .then((res) => res.data)
}

// Mapea cada valor de enum del backend (EstadoVuelo, EstadoReserva, Rol) a
// una variante de color consistente en toda la app, para no repetir esta
// decisión en cada página que muestra un estado.
const VARIANTES_POR_VALOR = {
  PROGRAMADO: 'badge-blue',
  EN_VUELO: 'badge-amber',
  FINALIZADO: 'badge-slate',
  DEMORADO: 'badge-amber',
  CANCELADO: 'badge-red',
  PENDIENTE_PAGO: 'badge-amber',
  CONFIRMADA: 'badge-green',
  CANCELADA: 'badge-red',
  ADMIN: 'badge-blue',
  USUARIO: 'badge-slate',
}

export const ETIQUETAS = {
  PROGRAMADO: 'Programado',
  EN_VUELO: 'En vuelo',
  FINALIZADO: 'Finalizado',
  DEMORADO: 'Demorado',
  CANCELADO: 'Cancelado',
  PENDIENTE_PAGO: 'Pendiente de pago',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
  ADMIN: 'Admin',
  USUARIO: 'Usuario',
}

export default function Badge({ value }) {
  const variante = VARIANTES_POR_VALOR[value] || 'badge-slate'
  const etiqueta = ETIQUETAS[value] || value

  return <span className={`badge ${variante}`}>{etiqueta}</span>
}

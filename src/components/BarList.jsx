// Lista de barras horizontales simple, sin depender de ninguna librería de
// gráficos (no hay acceso a npm en el entorno donde armé esto, así que
// preferí algo liviano hecho con Tailwind puro antes que instalar algo).
export default function BarList({ items }) {
  const total = items.reduce((acc, item) => acc + item.value, 0) || 1

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
            <span className="text-slate-400">{item.value}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full ${item.colorClass || 'bg-blue-500'}`}
              style={{ width: `${Math.round((item.value / total) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

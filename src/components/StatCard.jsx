export default function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <Icon />
      </div>
      <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm text-slate-400">{label}</div>
      {sub && <div className="mt-1 text-xs text-slate-400">{sub}</div>}
    </div>
  )
}

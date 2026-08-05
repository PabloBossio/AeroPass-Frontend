import { Link } from 'react-router-dom'
import { PlaneIcon } from './icons'

// Logo de la marca: badge circular con gradiente azul + ícono de avión,
// según el sistema de diseño acordado. size chico para navbars, grande
// para la landing.
export default function Logo({ size = 'md', showText = true, to = '/' }) {
  const badgeSize = size === 'lg' ? 'w-12 h-12' : 'w-9 h-9'
  const iconSize = size === 'lg' ? 'w-6 h-6' : 'w-[18px] h-[18px]'
  const textSize = size === 'lg' ? 'text-2xl' : 'text-lg'

  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <span
        className={`${badgeSize} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-600/30 flex items-center justify-center text-white -rotate-45 transition-transform group-hover:-rotate-[35deg]`}
      >
        <PlaneIcon className={iconSize} />
      </span>
      {showText && (
        <span className={`font-display font-extrabold text-slate-900 dark:text-white ${textSize}`}>
          AeroPass
        </span>
      )}
    </Link>
  )
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Paleta de fondo/superficies para modo oscuro (mismo tono navy
        // usado en los mockups de diseño: #0b1120).
        navy: {
          950: '#0b1120',
          900: '#0f172a',
        },
      },
      backgroundImage: {
        // Patrón de puntos usado en el hero de la landing (claro y oscuro).
        'dots-light':
          'radial-gradient(circle at 20% 25%, #bfdbfe 1.5px, transparent 1.5px), radial-gradient(circle at 75% 15%, #bfdbfe 1.5px, transparent 1.5px), radial-gradient(circle at 60% 55%, #bfdbfe 1.5px, transparent 1.5px), radial-gradient(circle at 15% 70%, #bfdbfe 1.5px, transparent 1.5px), radial-gradient(circle at 90% 80%, #bfdbfe 1.5px, transparent 1.5px)',
        'dots-dark':
          'radial-gradient(circle at 20% 25%, #ffffff 1.5px, transparent 1.5px), radial-gradient(circle at 75% 15%, #ffffff 1.5px, transparent 1.5px), radial-gradient(circle at 60% 55%, #ffffff 1.5px, transparent 1.5px), radial-gradient(circle at 15% 70%, #ffffff 1.5px, transparent 1.5px), radial-gradient(circle at 90% 80%, #ffffff 1.5px, transparent 1.5px)',
      },
      backgroundSize: {
        'dots-pattern': '160px 160px',
      },
    },
  },
  plugins: [],
}

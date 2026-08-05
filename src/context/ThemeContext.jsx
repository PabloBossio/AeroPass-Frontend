import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

// El <html> ya arranca con la clase "dark" puesta (o no) por el script
// anti-flash de index.html, así que acá solo leemos ese estado inicial
// en vez de decidirlo de nuevo.
function leerEstadoInicial() {
  return document.documentElement.classList.contains('dark')
}

export function ThemeProvider({ children }) {
  const [oscuro, setOscuro] = useState(leerEstadoInicial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', oscuro)
    localStorage.setItem('theme', oscuro ? 'dark' : 'light')
  }, [oscuro])

  function toggleTheme() {
    setOscuro((actual) => !actual)
  }

  return (
    <ThemeContext.Provider value={{ oscuro, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de un <ThemeProvider>')
  }
  return context
}

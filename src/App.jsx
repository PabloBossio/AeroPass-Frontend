import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import VuelosPage from './pages/VuelosPage'
import MisReservasPage from './pages/MisReservasPage'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<VuelosPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/mis-reservas"
            element={
              <ProtectedRoute>
                <MisReservasPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  )
}

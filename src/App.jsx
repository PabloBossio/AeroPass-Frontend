import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VuelosPage from './pages/VuelosPage'
import MisReservasPage from './pages/MisReservasPage'
import PagoExitoPage from './pages/PagoExitoPage'
import PagoCanceladoPage from './pages/PagoCanceladoPage'
import PerfilPage from './pages/PerfilPage'
import AdminLayout from './layouts/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import VuelosAdminPage from './pages/admin/VuelosAdminPage'
import AvionesAdminPage from './pages/admin/AvionesAdminPage'
import UsuariosAdminPage from './pages/admin/UsuariosAdminPage'
import ReservasAdminPage from './pages/admin/ReservasAdminPage'

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-navy-950">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vuelos" element={<VuelosPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route
            path="/mis-reservas"
            element={
              <ProtectedRoute>
                <MisReservasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pago/exito"
            element={
              <ProtectedRoute>
                <PagoExitoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pago/cancelado"
            element={
              <ProtectedRoute>
                <PagoCanceladoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <PerfilPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute soloAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="vuelos" element={<VuelosAdminPage />} />
            <Route path="aviones" element={<AvionesAdminPage />} />
            <Route path="usuarios" element={<UsuariosAdminPage />} />
            <Route path="reservas" element={<ReservasAdminPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  )
}

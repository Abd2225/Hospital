import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import HospitalList from "./pages/HospitalList"
import HospitalInfo from "./pages/HospitalInfo"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Admin from "./pages/Admin"
import HospitalDashboard from "./pages/HospitalDashboard"
import Profile from "./pages/Profile"

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["RegularUser"]}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospitals"
            element={
              <ProtectedRoute allowedRoles={["RegularUser"]}>
                <HospitalList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospitals/:hospitalId"
            element={
              <ProtectedRoute allowedRoles={["RegularUser"]}>
                <HospitalInfo />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital-dashboard"
            element={
              <ProtectedRoute allowedRoles={["HospitalAdmin"]}>
                <HospitalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["RegularUser"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App

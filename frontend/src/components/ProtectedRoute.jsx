"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isLoggedIn, role } = useContext(AuthContext)

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect based on role
    if (role === "Admin") {
      return <Navigate to="/admin" replace />
    } else if (role === "HospitalAdmin") {
      return <Navigate to="/hospital-dashboard" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute

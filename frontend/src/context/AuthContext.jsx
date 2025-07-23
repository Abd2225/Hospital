"use client"

import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))
  const [username, setUsername] = useState(localStorage.getItem("username") || "")
  const [role, setRole] = useState(localStorage.getItem("role") || "")

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"))
    setUsername(localStorage.getItem("username") || "")
    setRole(localStorage.getItem("role") || "")
  }, [])

  const login = (token, username, userRole) => {
    localStorage.setItem("token", token)
    localStorage.setItem("username", username)
    localStorage.setItem("role", userRole)
    setIsLoggedIn(true)
    setUsername(username)
    setRole(userRole)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("role")
    setIsLoggedIn(false)
    setUsername("")
    setRole("")
  }

  return <AuthContext.Provider value={{ isLoggedIn, username, role, login, logout }}>{children}</AuthContext.Provider>
}

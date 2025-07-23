"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      })

      const { token, username, isAdmin, admin_hospital } = res.data

      // Determine role based on backend information
      let role = "RegularUser"
      if (admin_hospital) role = "HospitalAdmin"
      else if (isAdmin) role = "Admin"

      // Save information in context
      login(token, username, role)

      // Redirect user based on role
      if (role === "Admin") navigate("/admin")
      else if (role === "HospitalAdmin") navigate("/hospital-dashboard")
      else navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login

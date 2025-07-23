"use client"

import { Link, useNavigate } from "react-router-dom"
import { FaHospital, FaUserCircle } from "react-icons/fa"
import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"

const Navbar = () => {
  const { isLoggedIn, username, role, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate("/login")
  }

  const handleProfileClick = () => {
    if (role === "RegularUser") {
      navigate("/profile")
    }
  }

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev)
  }

  return (
    <nav className="flex justify-between items-center py-5 sticky top-0 bg-slate-50 z-50 px-5 md:px-10 shadow-sm">
      <div className="flex items-center gap-2 text-2xl font-bold mb-4">
        <FaHospital className="text-blue-600 text-3xl" />
        <span>SYMEDICA</span>
      </div>

      <div className="hidden md:flex gap-6">
        {(role === "RegularUser" || !isLoggedIn) && (
          <>
            <Link to="/" className="text-slate-500 font-medium hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/hospitals" className="text-slate-500 font-medium hover:text-blue-600 transition">
              Hospitals
            </Link>
          </>
        )}
        {/* <Link to="/about" className="text-slate-500 font-medium hover:text-blue-600 transition">
          About
        </Link> */}
      </div>

      <div className="flex gap-4 items-center relative">
        {isLoggedIn ? (
          <div className="relative cursor-pointer">
            <div className="flex items-center gap-2" onClick={toggleDropdown}>
              <FaUserCircle className="text-blue-600 text-3xl" />
              <span className="font-medium text-slate-700 hidden sm:inline">{username}</span>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-md p-2 w-40">
                {role === "RegularUser" && (
                  <button
                    onClick={() => {
                      handleProfileClick()
                      setDropdownOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    Profile
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-500 font-medium hover:text-red-600 transition px-4 py-2 mt-1 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="border border-blue-600 text-blue-600 py-2 px-4 rounded-md font-medium hover:bg-blue-100 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar

"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [appointments, setAppointments] = useState([])
  const [medicalHistory, setMedicalHistory] = useState([])
  const [historyEntry, setHistoryEntry] = useState("")

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dob: "",
    address: "",
    blood: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setUser(res.data)
        setMedicalHistory(res.data.medicalHistory || [])

        setFormData({
          fullName: res.data.fullName || "",
          phone: res.data.phone || "",
          dob: res.data.dob ? new Date(res.data.dob).toISOString().substr(0, 10) : "",
          address: res.data.address || "",
          blood: res.data.blood || "",
        })

        const apptRes = await axios.get("http://localhost:5000/api/appointments/my", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setAppointments(apptRes.data)
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("username")
          localStorage.removeItem("role")
          navigate("/login")
        } else {
          console.error("Failed to fetch data:", error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("role")
    navigate("/login")
    window.location.reload()
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.put("http://localhost:5000/api/update-profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(res.data.user)
      setEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const handleAddHistory = async () => {
    if (!historyEntry.trim()) return

    try {
      const token = localStorage.getItem("token")
      const res = await axios.put(
        "http://localhost:5000/api/medical-history",
        { entry: historyEntry },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMedicalHistory(res.data.medicalHistory)
      setHistoryEntry("")
    } catch (error) {
      console.error("Failed to add medical history:", error)
    }
  }

  if (loading) return <div className="text-center py-10">Loading profile...</div>
  if (!user) return <div className="text-center py-10">User not found.</div>

  return (
    <div className="max-w-5xl mx-auto my-10 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-8 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold border-4 border-white">
          {user.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <h2 className="text-2xl font-semibold mt-4">{user.fullName}</h2>
        <p className="text-blue-100">{user.email}</p>
      </div>

      <div className="p-8 space-y-10">
        {/* Personal Info */}
        <section>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">Personal Information</h3>
          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-gray-500">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="p-3 border rounded w-full"
                />
              </div>
              <div>
                <label className="font-medium text-gray-500">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="p-3 border rounded w-full bg-gray-100"
                />
              </div>
              <div>
                <label className="font-medium text-gray-500">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="p-3 border rounded w-full"
                />
              </div>
              <div>
                <label className="font-medium text-gray-500">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="p-3 border rounded w-full"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-medium text-gray-500">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="p-3 border rounded w-full"
                />
              </div>
              <div>
                <label className="font-medium text-gray-500">Blood Type</label>
                <input
                  type="text"
                  name="blood"
                  value={formData.blood}
                  onChange={handleChange}
                  className="p-3 border rounded w-full"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-gray-500">Full Name</label>
                <p className="bg-gray-100 p-3 rounded">{user.fullName}</p>
              </div>
              <div>
                <label className="font-medium text-gray-500">Email</label>
                <p className="bg-gray-100 p-3 rounded">{user.email}</p>
              </div>
              <div>
                <label className="font-medium text-gray-500">Phone</label>
                <p className="bg-gray-100 p-3 rounded">{user.phone || "-"}</p>
              </div>
              <div>
                <label className="font-medium text-gray-500">Date of Birth</label>
                <p className="bg-gray-100 p-3 rounded">
                  {user.dob ? new Date(user.dob).toLocaleDateString() : "-"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="font-medium text-gray-500">Address</label>
                <p className="bg-gray-100 p-3 rounded">{user.address || "-"}</p>
              </div>
              <div>
                <label className="font-medium text-gray-500">Blood Type</label>
                <p className="bg-gray-100 p-3 rounded">{user.blood || "-"}</p>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            {editing ? (
              <>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="border border-gray-500 text-gray-700 px-6 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </section>

        {/* Appointments */}
        <section>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">Scheduled Appointments</h3>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border text-left">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Time</th>
                    <th className="px-4 py-2 border">Doctor</th>
                    <th className="px-4 py-2 border">Hospital</th>
                    <th className="px-4 py-2 border">Department</th>
                    <th className="px-4 py-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{new Date(appt.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border">{appt.time}</td>
                      <td className="px-4 py-2 border">{appt.doctorId?.name || "-"}</td>
                      <td className="px-4 py-2 border">{appt.hospitalId?.name || "-"}</td>
                      <td className="px-4 py-2 border">{appt.departmentId?.name || "-"}</td>
                      <td className="px-4 py-2 border capitalize">{appt.status || "pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Medical History */}
        <section>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">Medical History</h3>

          {/* Entry Input */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={historyEntry}
              onChange={(e) => setHistoryEntry(e.target.value)}
              placeholder="Add medical history entry..."
              className="flex-1 p-3 border rounded"
            />
            <button
              onClick={handleAddHistory}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          {/* Horizontal Cards */}
          {medicalHistory.length > 0 ? (
            <div className="flex overflow-x-auto gap-4 pb-2">
              {medicalHistory.map((entry, index) => (
                <div
                  key={index}
                  className="min-w-[250px] bg-white border shadow-md rounded-lg p-4"
                >
                  <h4 className="font-semibold text-blue-700 mb-2">Entry {index + 1}</h4>
                  <p className="text-gray-700">{entry}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No medical history entries found.</p>
          )}
        </section>

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-4"
            onClick={() => navigate("/")}
          >
            <i className="fas fa-home mr-2" /> Back to Home
          </button>
          <button
            className="border border-gray-500 text-gray-700 px-6 py-2 rounded hover:bg-gray-100"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile

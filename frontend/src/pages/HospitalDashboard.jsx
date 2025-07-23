"use client"
import { useState, useEffect } from "react"
import { FaTrash } from "react-icons/fa"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

const HospitalDashboard = () => {
  const [departments, setDepartments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)

  // Popups states
  const [showDepPopup, setShowDepPopup] = useState(false)
  const [newDep, setNewDep] = useState("")
  const [showDocPopup, setShowDocPopup] = useState(false)
  const [newDoc, setNewDoc] = useState({ name: "", specialty: "" })
  const [showMedPopup, setShowMedPopup] = useState(false)
  const [newMed, setNewMed] = useState({ name: "", manufacturer: "" })

  // Get token and hospitalId from token
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const hospitalId = (() => {
    try {
      return token ? jwtDecode(token).hospitalId : null
    } catch {
      return null
    }
  })()

  const config = { headers: { Authorization: `Bearer ${token}` } }

  // FIXED: Fetch all hospital related data
  const fetchAllData = async () => {
    setLoading(true)
    try {
      if (!hospitalId) {
        alert("No hospitalId found in token")
        setLoading(false)
        return
      }

      const [appointmentsRes, departmentsRes, doctorsRes, medicinesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/appointments/hospital/${hospitalId}`, config),
        axios.get(`http://localhost:5000/api/departments/hospital/${hospitalId}`, config),
        axios.get(`http://localhost:5000/api/doctors/hospital/${hospitalId}`, config),
        axios.get(`http://localhost:5000/api/medicines/hospital/${hospitalId}`, config),
      ])

      setAppointments(appointmentsRes.data)
      setDepartments(departmentsRes.data)
      setDoctors(doctorsRes.data)
      setMedicines(medicinesRes.data)
    } catch (error) {
      console.error("Error loading data:", error)
      alert("Error fetching hospital data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Confirm appointment
  const confirmAppointment = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/confirm`, {}, config)
      setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status: "confirmed" } : a)))
    } catch (error) {
      console.error(error)
      alert("Failed to confirm appointment")
    }
  }

  // Remove appointment
  const removeAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`, config)
      setAppointments((prev) => prev.filter((a) => a._id !== id))
    } catch (error) {
      console.error(error)
      alert("Failed to remove appointment")
    }
  }

  // Add department
  const handleAddDepartment = async () => {
    if (!newDep.trim()) return
    try {
      const res = await axios.post("http://localhost:5000/api/departments", { name: newDep.trim(), hospitalId }, config)
      setDepartments((prev) => [...prev, res.data])
      setNewDep("")
      setShowDepPopup(false)
      window.location.reload
    } catch (error) {
      console.error(error)
      alert("Failed to add department")
    }
  }

  // Remove department
  const removeDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/departments/${id}`, config)
      setDepartments((prev) => prev.filter((d) => d._id !== id))
    } catch (error) {
      console.error(error)
      alert("Failed to remove department")
    }
  }

  // Add doctor
  const handleAddDoctor = async () => {
    if (!newDoc.name || !newDoc.specialty) return
    try {
      const res = await axios.post(
        "http://localhost:5000/api/doctors",
        { name: newDoc.name, specialization: newDoc.specialty, hospital: hospitalId },
        config,
      )
      setDoctors((prev) => [...prev, res.data])
      setNewDoc({ name: "", specialty: "" })
      setShowDocPopup(false)
    } catch (error) {
      console.error(error)
      alert("Failed to add doctor")
    }
  }

  // Remove doctor
  const removeDoctor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${id}`, config)
      setDoctors((prev) => prev.filter((d) => d._id !== id))
    } catch (error) {
      console.error(error)
      alert("Failed to remove doctor")
    }
  }

  // Update doctor in state (local edit only)
  const updateDoctor = (id, field, value) => {
    setDoctors((prev) => prev.map((d) => (d._id === id ? { ...d, [field]: value } : d)))
  }

  // Add medicine
  const handleAddMedicine = async () => {
    if (!newMed.name || !newMed.manufacturer) return
    try {
      const res = await axios.post(
        "http://localhost:5000/api/medicines",
        { name: newMed.name, company: newMed.manufacturer, hospitalId },
        config,
      )
      setMedicines((prev) => [...prev, res.data])
      setNewMed({ name: "", manufacturer: "" })
      setShowMedPopup(false)
    } catch (error) {
      console.error(error)
      alert("Failed to add medicine")
    }
  }

  // Remove medicine
  const removeMedicine = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/medicines/${id}`, config)
      setMedicines((prev) => prev.filter((m) => m._id !== id))
    } catch (error) {
      console.error(error)
      alert("Failed to remove medicine")
    }
  }

  // Show popup helpers
  const addDepartment = () => setShowDepPopup(true)
  const addDoctor = () => setShowDocPopup(true)
  const addMedicine = () => setShowMedPopup(true)

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Hospital Dashboard</h1>

      {/* Appointments Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500 italic">No appointments scheduled.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white p-4 rounded-lg border shadow flex flex-col md:flex-row md:justify-between md:items-center gap-2"
              >
                <div>
                  <p className="font-semibold">{appointment.userId?.fullName || "Unknown Patient"}</p>
                  <p className="text-gray-500 text-sm">
                    {appointment.date} at {appointment.time} with {appointment.doctorId?.name || "Unknown Doctor"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Department: {appointment.departmentId?.name || "Unknown Department"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appointment.status}
                  </span>
                  {appointment.status === "pending" && (
                    <button
                      onClick={() => confirmAppointment(appointment._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                    >
                      Confirm
                    </button>
                  )}
                  <button
                    onClick={() => removeAppointment(appointment._id)}
                    className="text-red-500 hover:text-red-700 text-xl"
                    title="Delete appointment"
                  >
                    <FaTrash className="text-red-500 hover:text-red-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Departments Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Departments</h2>
          <button onClick={addDepartment} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            + Add Department
          </button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {departments.length === 0 && <p className="text-gray-500 italic">No departments added.</p>}
          {departments.map((dep) => (
            <div key={dep._id} className="bg-white shadow p-4 rounded-lg flex justify-between items-center border">
              <span>{dep.name}</span>
              <button onClick={() => removeDepartment(dep._id)} className="text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Doctors Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Doctors</h2>
          <button onClick={addDoctor} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            + Add Doctor
          </button>
        </div>
        <div className="space-y-4">
          {doctors.length === 0 && <p className="text-gray-500 italic">No doctors added.</p>}
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white p-4 rounded-lg shadow border flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={doc.name}
                  onChange={(e) => updateDoctor(doc._id, "name", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <input
                  type="text"
                  value={doc.specialization}
                  onChange={(e) => updateDoctor(doc._id, "specialization", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button onClick={() => removeDoctor(doc._id)} className="text-red-500 hover:text-red-700 text-xl">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Medicines Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Available Medicines</h2>
          <button onClick={addMedicine} className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            + Add Medicine
          </button>
        </div>
        <div className="space-y-4">
          {medicines.length === 0 && <p className="text-gray-500 italic">No medicines available.</p>}
          {medicines.map((med) => (
            <div key={med._id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
              <div>
                <p className="font-semibold text-blue-800">{med.name}</p>
                <p className="text-gray-500 text-sm">Manufacturer: {med.company}</p>
              </div>
              <button onClick={() => removeMedicine(med._id)} className="text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Department Popup */}
      {showDepPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Department</h3>
            <input
              type="text"
              value={newDep}
              onChange={(e) => setNewDep(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Department Name"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDepPopup(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={handleAddDepartment} className="px-4 py-2 bg-blue-600 text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Popup */}
      {showDocPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Doctor</h3>
            <input
              type="text"
              value={newDoc.name}
              onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Doctor Name"
              autoFocus
            />
            <input
              type="text"
              value={newDoc.specialty}
              onChange={(e) => setNewDoc({ ...newDoc, specialty: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Specialty"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDocPopup(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={handleAddDoctor} className="px-4 py-2 bg-green-600 text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medicine Popup */}
      {showMedPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Medicine</h3>
            <input
              type="text"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Medicine Name"
              autoFocus
            />
            <input
              type="text"
              value={newMed.manufacturer}
              onChange={(e) => setNewMed({ ...newMed, manufacturer: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Manufacturer"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowMedPopup(false)} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={handleAddMedicine} className="px-4 py-2 bg-purple-600 text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HospitalDashboard

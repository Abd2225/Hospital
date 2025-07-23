"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const AppointmentPopup = ({ isOpen, onClose, hospitalId }) => {
  const [departments, setDepartments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && hospitalId) {
      fetchDepartments()
    }
  }, [isOpen, hospitalId])

  useEffect(() => {
    if (selectedDepartment && hospitalId) {
      fetchDoctors()
    }
  }, [selectedDepartment, hospitalId])

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/departments/hospital/${hospitalId}`)
      setDepartments(res.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doctors/hospital/${hospitalId}`)
      setDoctors(res.data)
    } catch (error) {
      console.error("Error fetching doctors:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem("token")
    if (!token) {
      alert("Please login to book an appointment")
      setLoading(false)
      return
    }

    try {
      const appointmentData = {
        doctorId: selectedDoctor,
        hospitalId: hospitalId,
        departmentId: selectedDepartment,
        date: date,
        time: time,
      }

      await axios.post("http://localhost:5000/api/appointments", appointmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      alert("Appointment booked successfully!")
      onClose()
      setSelectedDepartment("")
      setSelectedDoctor("")
      setDate("")
      setTime("")
    } catch (error) {
      console.error("Error booking appointment:", error)
      alert(error.response?.data?.message || "Failed to book appointment")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl w-full max-w-md relative shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-red-500 transition-colors duration-200"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Book Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-2 text-slate-700">Department</label>
            <select
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:outline-none transition-colors duration-200 bg-white"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-slate-700">Doctor</label>
            <select
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:outline-none transition-colors duration-200 bg-white disabled:bg-slate-100"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
              disabled={!selectedDepartment}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-slate-700">Date</label>
            <input
              type="date"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:outline-none transition-colors duration-200"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-slate-700">Time</label>
            <select
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-slate-400 focus:outline-none transition-colors duration-200 bg-white"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              <option value="">Select Time</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-slate-700 to-slate-800 text-white w-full py-3 rounded-xl hover:from-slate-800 hover:to-slate-900 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AppointmentPopup

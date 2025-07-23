"use client"

import { useParams, useNavigate } from "react-router-dom"
import AppointmentPopup from "../components/AppointmentPopup"
import { useState, useEffect } from "react"
import axios from "axios"

const HospitalInfo = () => {
  const { hospitalId } = useParams()
  const navigate = useNavigate()
  const [hospital, setHospital] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
    const [medicines, setMedicines] = useState([]) // Added medicines state

  const [loading, setLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        // Fetch hospital details
        const hospitalRes = await axios.get(`http://localhost:5000/api/hospitals/${hospitalId}`)
        setHospital(hospitalRes.data)

        // Fetch doctors for this hospital
        const doctorsRes = await axios.get(`http://localhost:5000/api/doctors/hospital/${hospitalId}`)
        setDoctors(doctorsRes.data)

        // Fetch departments for this hospital
        const departmentsRes = await axios.get(`http://localhost:5000/api/departments/hospital/${hospitalId}`)
        setDepartments(departmentsRes.data)

           // Fetch medicines for this hospital
        const medicinesRes = await axios.get(`http://localhost:5000/api/medicines/hospital/${hospitalId}`)
        setMedicines(medicinesRes.data)
      } catch (error) {
        console.error("Error fetching hospital data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHospitalData()
  }, [hospitalId])

  if (loading) {
    return <div className="text-center py-10">Loading hospital information...</div>
  }

  if (!hospital) {
    return <div className="text-center py-10">Hospital not found.</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="rounded-lg overflow-hidden shadow-md mb-10 bg-white">
        {/* Header Image and Info */}
        <div className="relative h-[350px]">
          <img
            src={
              hospital.image
                ? `http://localhost:5000/uploads/${hospital.image}`
                : "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3"
            }
            alt={hospital.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{hospital.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-map-marker-alt"></i>
              <span>{hospital.address}</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 font-semibold">
              <i className="fas fa-star"></i>
              <span>4.7 (1,242 reviews)</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-10">
          {/* About */}
          <section>
            <h3 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">About</h3>
            <p className="text-gray-700">
              {hospital.about ||
                `${hospital.name} is a leading healthcare provider with state-of-the-art facilities and a team of board-certified specialists. We provide comprehensive medical services with a patient-centered approach.`}
            </p>
          </section>

          {/* Departments & Services */}
          <section>
            <h3 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-2">Departments & Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <div key={dept._id} className="bg-gray-100 p-5 rounded-lg border-1 border-blue-300">
                    <div className="font-semibold text-lg mb-1">{dept.name}</div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-gray-500">No departments available.</div>
              )}
            </div>
          </section>

          {/* Doctors */}
          <section>
            <h3 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-2">Our Doctors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {doctors.length > 0 ? (
                doctors.map((doc) => (
                  <div
                    key={doc._id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-1 border-blue-300"
                  >
                    <div className="flex items-center gap-5 mb-4">
                      <div className="w-16 h-16 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-xl">
                        {doc.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold">{doc.name}</h4>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg py-2 px-4 mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-700">
                      <i className="fas fa-stethoscope"></i> {doc.specialization}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-gray-500">No doctors available.</div>
              )}
            </div>
          </section>

           {/* Medicines Section */}
          <section className="my-10 text-center">
            <h3 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-2">Medicines Available</h3>
            {medicines.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-6">
                {medicines.map((med) => (
                  <div
                    key={med._id}
                    className="bg-white rounded-lg shadow-md p-5 w-60 flex flex-col items-center border border-blue-300"
                  >
                    <h4 className="text-lg font-semibold mb-2">{med.name}</h4>
                    <p className="text-gray-600 mb-4">{med.company || "Unknown Manufacturer"}</p>
                  
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No medicines available.</p>
            )}
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
              <div>
                <p>
                  <strong>Phone:</strong> {hospital.phone || "N/A"}
                </p>
                <p>
                  <strong>Emergency:</strong> {hospital.emergencyPhone || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {hospital.email || "N/A"}
                </p>
              </div>
              <div>
                <p>
                  <strong>Visiting Hours:</strong> 8:00 AM - 8:00 PM
                </p>
                <p>
                  <strong>Address:</strong> {hospital.address}
                </p>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate("/hospitals")}
              className="border border-gray-500 text-gray-700 px-6 py-2 rounded hover:bg-gray-100 transition flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i> Back to Hospitals
            </button>
            <button
              onClick={() => setShowPopup(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
            >
              <i className="fas fa-calendar-alt"></i> Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Fixed: Pass hospitalId to AppointmentPopup */}
      <AppointmentPopup isOpen={showPopup} onClose={() => setShowPopup(false)} hospitalId={hospitalId} />
    </div>
  )
}

export default HospitalInfo

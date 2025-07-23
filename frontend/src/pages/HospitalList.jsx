"use client";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const HospitalList = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");


  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/hospitals");
        const hospitalData = res.data;
        console.log(hospitalData);

        // جلب الأقسام لكل مشفى
        const hospitalsWithDepartments = await Promise.all(
          hospitalData.map(async (hospital) => {
            const depRes = await axios.get(
              `http://localhost:5000/api/departments/hospital/${hospital._id}`
            );

            console.log(hospital);
            return {
              ...hospital,
              departments: depRes.data || [],
            };
          })
        );

        setHospitals(hospitalsWithDepartments);
      } catch (error) {
        console.error("Error fetching hospitals or departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);



  const handleView = (hospitalId) => {
    navigate(`/hospitals/${hospitalId}`);
  };

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesName = hospital.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedSpecialty === "All Specialties" ||
      hospital.departments.some(
        (dep) => dep.name.toLowerCase() === selectedSpecialty.toLowerCase()
      );

    return matchesName && matchesDepartment;
  });

  if (loading) {
    return <div className="text-center py-10">Loading hospitals...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Find Hospitals</h1>

      {/* Search inputs - keeping original design */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-465">
        <input
          type="text"
          placeholder="Search by hospital name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All Specialties</option>
          <option>Cardiology</option>
          <option>Neurology</option>
          <option>Pediatrics</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredHospitals.map((hospital) => (
          <div
            key={hospital._id}
            className="border rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div
              className="h-48 rounded-t-lg bg-cover bg-center"
              style={{
                backgroundImage: hospital.image
                  ? `url('http://localhost:5000/uploads/${hospital.image}')`
                  : "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3')",
              }}
            ></div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{hospital.name}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <svg
                  className="h-5 w-5 mr-1 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.414 1.414 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{hospital.address}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {hospital.departments.map((dep, index) => (
                  <span
                    key={index}
                    className={`text-sm font-medium px-2.5 py-0.5 rounded ${
                      index % 3 === 0
                        ? "bg-blue-100 text-blue-800"
                        : index % 3 === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {dep.name}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-yellow-400 font-semibold">
                  <svg
                    className="h-5 w-5 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.172c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.043 9.393c-.783-.57-.38-1.81.588-1.81h4.172a1 1 0 00.95-.69l1.286-3.966z" />
                  </svg>
                  4.7 (1,242 reviews)
                </div>
                <button
                  onClick={() => handleView(hospital._id)}
                  className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-500 hover:text-white transition"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalList;

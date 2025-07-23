import { useState, useEffect } from "react";
import axios from "axios";
import { FaMinus } from "react-icons/fa";

const Admin = () => {
  const [doctors, setDoctors] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [hospitalDoctors, setHospitalDoctors] = useState({});
  const [hospitalDepartments, setHospitalDepartments] = useState({});
  const [editingHospitalId, setEditingHospitalId] = useState(null);

  const [editData, setEditData] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return setImagePreview(null);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const addDoctor = () => {
    setDoctors([...doctors, { name: "", specialization: "" }]);
  };

  const removeDoctor = (index) => {
    const updated = [...doctors];
    updated.splice(index, 1);
    setDoctors(updated);
  };

  const handleDoctorChange = (index, field, value) => {
    const updated = [...doctors];
    updated[index][field] = value;
    setDoctors(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);

    try {
      const departments = data.getAll("departments");
      const imageFile = data.get("hospital-image");

      const formData = new FormData();
      formData.append("name", data.get("hospital-name"));
      formData.append("address", data.get("hospital-location"));
      formData.append("phone", data.get("hospital-phone"));
      formData.append("email", data.get("hospital-email"));
      formData.append("emergencyPhone", data.get("hospital-emergency"));
      formData.append("admin_email", data.get("hospital-admin-email"));
      formData.append("admin_password", data.get("hospital-admin-password"));
      if (imageFile) formData.append("image", imageFile);
      formData.append("departments", JSON.stringify(departments));
      formData.append("doctors", JSON.stringify(doctors));

      const token = localStorage.getItem("token");

      if (editingHospitalId) {
        await axios.put(
          `http://localhost:5000/api/hospitals/${editingHospitalId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Hospital updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/hospitals", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Hospital, doctors, and admin added successfully!");
      }

      e.target.reset();
      setDoctors([]);
      setImagePreview(null);
      setEditingHospitalId(null);
      setEditData(null);
      window.location.reload(); // أو أعد جلب المشافي فقط
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save hospital.");
    }
  };

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/hospitals");
        setHospitals(res.data);
        res.data.forEach((hospital) => {
          fetchDoctorsForHospital(hospital._id);
          fetchDepartmentsForHospital(hospital._id);
        });
      } catch (err) {
        console.error("Error fetching hospitals", err);
      }
    };

    fetchHospitals();
  }, []);

  const fetchDoctorsForHospital = async (hospitalId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/doctors/hospital/${hospitalId}`
      );
      setHospitalDoctors((prev) => ({
        ...prev,
        [hospitalId]: res.data || [],
      }));
    } catch (err) {
      console.error("Error fetching doctors for hospital:", hospitalId, err);
    }
  };

  const fetchDepartmentsForHospital = async (hospitalId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/departments/hospital/${hospitalId}`
      );
      setHospitalDepartments((prev) => ({
        ...prev,
        [hospitalId]: res.data || [],
      }));
    } catch (err) {
      console.error(
        "Error fetching departments for hospital:",
        hospitalId,
        err
      );
    }
  };

  const handleDeleteHospital = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/hospitals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHospitals(hospitals.filter((h) => h._id !== id));
      alert("Hospital deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete hospital.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-sm rounded-xl p-6 mt-2 space-y-6 border border-blue-500"
      >
        <h2 className="text-xl font-semibold text-blue-600">
          Add New Hospital
        </h2>

        {/* Hospital Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="hospital-name"
            required
            placeholder="Hospital Name"
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            name="hospital-location"
            required
            placeholder="Location"
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            name="hospital-phone"
            required
            placeholder="Phone Number"
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            name="hospital-email"
            type="email"
            required
            placeholder="Email Address"
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            name="hospital-emergency"
            required
            placeholder="Emergency Number"
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            name="hospital-admin-email"
            type="email"
            required
            placeholder="Admin Email"
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          <input
            name="hospital-admin-password"
            type="password"
            required
            placeholder="Admin Password"
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        {/* Departments */}
        <div>
          <label className="block font-medium mb-2">Departments</label>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              "Cardiology",
              "Pediatrics",
              "Neurology",
              "Orthopedics",
              "Emergency`ER`",
              "Surgery",
              "Radiology",
              "Plastic surgery",
              "Urology",
              "ICU",
              "Obstetrics",
              "Dermatology",
            ].map((dep) => (
              <label key={dep} className="flex items-center gap-2">
                <input type="checkbox" name="departments" value={dep} /> {dep}
              </label>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-2">Hospital Image</label>
          <div className="flex items-center gap-4">
            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer">
              <i className="fas fa-upload mr-2"></i> Upload Image
              <input
                type="file"
                name="hospital-image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <div className="w-32 h-32 border border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400 text-sm">No image selected</span>
              )}
            </div>
          </div>
        </div>

        {/* Doctors */}
        <div>
          <label className="block font-medium mb-2">Doctors</label>
          <div className="space-y-4">
            {doctors.map((doctor, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input
                  type="text"
                  required
                  placeholder="Doctor name"
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                  value={doctor.name}
                  onChange={(e) =>
                    handleDoctorChange(index, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  required
                  placeholder="Specialty"
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                  value={doctor.specialization}
                  onChange={(e) =>
                    handleDoctorChange(index, "specialization", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  onClick={() => removeDoctor(index)}
                >
                  <FaMinus />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
              onClick={addDoctor}
            >
              <i className="fas fa-plus"></i> Add Doctor
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="reset"
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Hospital
          </button>
        </div>
      </form>

      <div className="mt-10 bg-white shadow-sm rounded-xl p-6 border border-gray-300">
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Existing Hospitals
        </h2>

        {hospitals.length === 0 ? (
          <p className="text-gray-500">No hospitals found.</p>
        ) : (
          <div className="space-y-6">
            {hospitals.map((hospital) => (
              <div key={hospital._id} className="border-b pb-4">
                <h3 className="text-lg font-bold text-blue-800">
                  {hospital.name}
                </h3>
                <p className="text-gray-700">📍 {hospital.address}</p>
                <p className="text-gray-700">📞 {hospital.phone}</p>

                {/* الأقسام */}
                <div className="flex flex-wrap gap-2 my-2">
                  {(hospitalDepartments[hospital._id] || []).map((dep, i) => (
                    <span
                      key={i}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                    >
                      {typeof dep === "string" ? dep : dep.name}
                    </span>
                  ))}
                </div>

                {/* الأطباء */}
                <div className="mt-1">
                  <p className="font-semibold text-sm mb-1">Doctors:</p>
                  <ul className="list-disc list-inside text-sm text-gray-800">
                    {(hospitalDoctors[hospital._id] || []).map((doc, i) => (
                      <li key={i}>
                        {doc.name} – {doc.specialization}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* الأزرار */}
                <div className="mt-2 flex gap-4">
                  <button
                    onClick={() => handleDeleteHospital(hospital._id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑 Delete
                  </button>

                  <button
                    onClick={() => {
                      setEditingHospitalId(hospital._id);
                      setEditData(hospital);
                      setDoctors(hospitalDoctors[hospital._id] || []);
                      setImagePreview(
                        hospital.image
                          ? `http://localhost:5000/uploads/${hospital.image}`
                          : null
                      );

                      setTimeout(() => {
                        document.querySelector(
                          "input[name='hospital-name']"
                        ).value = hospital.name || "";
                        document.querySelector(
                          "input[name='hospital-location']"
                        ).value = hospital.address || "";
                        document.querySelector(
                          "input[name='hospital-phone']"
                        ).value = hospital.phone || "";
                        document.querySelector(
                          "input[name='hospital-email']"
                        ).value = hospital.email || "";
                        document.querySelector(
                          "input[name='hospital-emergency']"
                        ).value = hospital.emergencyPhone || "";
                        document.querySelector(
                          "input[name='hospital-admin-email']"
                        ).value = hospital.admin_email || "";
                        document.querySelector(
                          "input[name='hospital-admin-password']"
                        ).value = ""; // لا نظهر كلمة السر

                        const selectedDepsRaw =
                          hospitalDepartments[hospital._id] || [];
                        const selectedDeps = selectedDepsRaw.map((dep) =>
                          typeof dep === "string" ? dep : dep.name
                        );

                        document
                          .querySelectorAll("input[name='departments']")
                          .forEach((checkbox) => {
                            checkbox.checked = selectedDeps.includes(
                              checkbox.value
                            );
                          });
                      }, 0);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

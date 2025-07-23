const Doctor = require("../models/Doctor")

exports.addDoctor = async (req, res) => {
  try {
    // Allow both admin and hospital admin to add doctors
    if (!req.user.isAdmin && !req.user.admin_hospital) {
      return res.status(403).json({ message: "Only admin or hospital admin can add doctors" })
    }

    const { name, specialization, hospital } = req.body

    // If hospital admin, use their hospitalId
    const hospitalId = req.user.admin_hospital ? req.user.hospitalId : hospital

    const doctor = new Doctor({ name, specialization, hospital: hospitalId })
    await doctor.save()
    res.status(201).json({ message: "Doctor added", doctor })
  } catch (err) {
    res.status(500).json({ message: "Error adding doctor", error: err.message })
  }
}

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("hospital", "name address")
    res.json(doctors)
  } catch (err) {
    res.status(500).json({ message: "Error getting doctors" })
  }
}

exports.getDoctorsByHospital = async (req, res) => {
  try {
    const doctors = await Doctor.find({ hospital: req.params.id })
    res.json(doctors)
  } catch (err) {
    res.status(500).json({ message: "Error getting doctors for hospital" })
  }
}

exports.updateDoctor = async (req, res) => {
  try {
    if (!req.user.isAdmin && !req.user.admin_hospital) {
      return res.status(403).json({ message: "Only admin or hospital admin can update doctors" })
    }

    const { name, specialization, hospital, department } = req.body
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { name, specialization, hospital, department },
      { new: true },
    )
    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" })
    }
    res.json({ message: "Doctor updated", doctor: updatedDoctor })
  } catch (err) {
    res.status(500).json({ message: "Error updating doctor", error: err.message })
  }
}

exports.deleteDoctor = async (req, res) => {
  try {
    if (!req.user.isAdmin && !req.user.admin_hospital) {
      return res.status(403).json({ message: "Only admin or hospital admin can delete doctors" })
    }

    const deleted = await Doctor.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: "Doctor not found" })
    }
    res.json({ message: "Doctor deleted" })
  } catch (err) {
    res.status(500).json({ message: "Error deleting doctor", error: err.message })
  }
}

// Get total count of doctors
exports.getDoctorCount = async (req, res) => {
  try {
    const count = await Doctor.countDocuments()
    res.json({ count })
  } catch (err) {
    res.status(500).json({ message: "Error getting doctor count", error: err.message })
  }
}

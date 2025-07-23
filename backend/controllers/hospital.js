const Hospital = require("../models/Hospital")
const Doctor = require("../models/Doctor")
const Department = require("../models/Department")
const bcrypt = require("bcryptjs")
const User = require("../models/User")

// Get all hospitals
exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find()
    res.json(hospitals)
  } catch (err) {
    res.status(500).json({ message: "Error getting hospitals." })
  }
}

// Get one hospital by ID
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
    if (!hospital) return res.status(404).json({ message: "Hospital not found." })
    res.json(hospital)
  } catch (err) {
    res.status(500).json({ message: "Error getting hospital." })
  }
}

// FIXED: Create a hospital (Admin only)
exports.addHospital = async (req, res) => {
  try {
    console.log("Body:", req.body)
    const { name, address, phone, email, emergencyPhone, admin_email, admin_password } = req.body
    const image = req.file ? req.file.filename : req.body.image

    // Validate required fields
    if (!name || !admin_email || !admin_password) {
      return res.status(400).json({ message: "Hospital name, admin email, and admin password are required." })
    }

    // Check if admin email already exists
    const existingAdmin = await User.findOne({ email: admin_email })
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin email already exists." })
    }

    // Create the hospital first
    const hospital = new Hospital({
      name,
      address,
      phone,
      email,
      emergencyPhone,
      image,
    })
    await hospital.save()

    // Create hospital admin user
    const hashedPassword = await bcrypt.hash(admin_password, 10)
    const adminUser = new User({
      fullName: `${name} Admin`, // Set a default fullName
      email: admin_email,
      password: hashedPassword,
      isAdmin: false,
      admin_hospital: true,
      hospitalId: hospital._id,
    })
    await adminUser.save()

    // Add departments if provided
    const departments = req.body.departments ? JSON.parse(req.body.departments) : []
    for (const depName of departments) {
      if (depName && depName.trim()) {
        const dep = new Department({ name: depName.trim(), hospitalId: hospital._id })
        await dep.save()
      }
    }

    // Add doctors if provided
    const doctors = req.body.doctors ? JSON.parse(req.body.doctors) : []
    for (const d of doctors) {
      if (d.name && d.specialty) {
        const doc = new Doctor({
          name: d.name,
          specialization: d.specialty,
          hospital: hospital._id,
        })
        await doc.save()
      }
    }

    res.status(201).json({
      message: "Hospital and admin added successfully.",
      hospital: hospital,
      adminEmail: admin_email,
    })
  } catch (err) {
    console.error("Error in addHospital:", err)
    res.status(500).json({ message: "Error adding hospital and admin", error: err.message })
  }
}

// Update hospital by ID
exports.updateHospitalById = async (req, res) => {
  try {
    const { name, address, phone, email } = req.body
    const image = req.file ? req.file.filename : null
    const updateData = {
      name,
      address,
      phone,
      email,
    }
    if (image) {
      updateData.image = image
    }

    const updatedHospital = await Hospital.findByIdAndUpdate(req.params.id, updateData, { new: true })
    if (!updatedHospital) {
      return res.status(404).json({ message: "Hospital not found." })
    }
    res.json({ message: "Hospital updated", hospital: updatedHospital })
  } catch (err) {
    res.status(500).json({ message: "Error updating hospital", error: err.message })
  }
}

// Delete hospital by ID
exports.deleteHospitalById = async (req, res) => {
  try {
    const deletedHospital = await Hospital.findByIdAndDelete(req.params.id)
    if (!deletedHospital) {
      return res.status(404).json({ message: "Hospital not found." })
    }
    res.json({ message: "Hospital deleted successfully." })
  } catch (err) {
    res.status(500).json({ message: "Error deleting hospital", error: err.message })
  }
}

// Get total count of hospitals
exports.getHospitalCount = async (req, res) => {
  try {
    const count = await Hospital.countDocuments()
    res.json({ count })
  } catch (err) {
    res.status(500).json({ message: "Error getting hospital count", error: err.message })
  }
}

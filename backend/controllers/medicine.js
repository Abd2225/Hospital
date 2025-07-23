const Medicine = require("../models/Medicine")

// Get all medicines
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().populate("hospitalId", "name")
    res.json(medicines)
  } catch (error) {
    console.error("Error fetching medicines:", error)
    res.status(500).json({ message: "Error fetching medicines" })
  }
}

// Get medicines by hospital ID
exports.getMedicinesByHospital = async (req, res) => {
  try {
    const medicines = await Medicine.find({ hospitalId: req.params.id })
    res.json(medicines)
  } catch (error) {
    console.error("Error fetching hospital's medicines:", error)
    res.status(500).json({ message: "Error fetching hospital's medicines" })
  }
}

// Add medicine
exports.addMedicine = async (req, res) => {
  try {
    // Allow both admin and hospital admin to add medicines
    if (!req.user.isAdmin && !req.user.admin_hospital) {
      return res.status(403).json({ message: "Only admin or hospital admin can add medicines" })
    }

    const { name, company, hospitalId } = req.body

    // If hospital admin, use their hospitalId
    const finalHospitalId = req.user.admin_hospital ? req.user.hospitalId : hospitalId

    const medicine = new Medicine({ name, company, hospitalId: finalHospitalId })
    await medicine.save()
    res.status(201).json({ message: "Medicine added", medicine })
  } catch (error) {
    console.error("Error adding medicine:", error)
    res.status(500).json({ message: "Error adding medicine" })
  }
}

// Delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    // Allow both admin and hospital admin to delete medicines
    if (!req.user.isAdmin && !req.user.admin_hospital) {
      return res.status(403).json({ message: "Only admin or hospital admin can delete medicines" })
    }

    const deleted = await Medicine.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Medicine not found" })
    res.json({ message: "Medicine deleted" })
  } catch (error) {
    console.error("Error deleting medicine:", error)
    res.status(500).json({ message: "Error deleting medicine" })
  }
}

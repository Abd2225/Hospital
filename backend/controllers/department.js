const Department = require("../models/Department")

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("hospitalId", "name")
    res.json(departments)
  } catch (error) {
    res.status(500).json({ message: "Error fetching departments" })
  }
}

// Get departments by hospital ID
exports.getDepartmentsByHospital = async (req, res) => {
  try {
    const departments = await Department.find({ hospitalId: req.params.id })
    res.json(departments)
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospital's departments" })
  }
}

// Add department
exports.addDepartment = async (req, res) => {
  try {
    // Allow both admin and hospital admin to add departments
    if (!req.user.isAdmin && !req.user.admin_hospital) {
      return res.status(403).json({ message: "Only admin or hospital admin can add departments" })
    }

    const { name, hospitalId } = req.body

    // If hospital admin, use their hospitalId
    const finalHospitalId = req.user.admin_hospital ? req.user.hospitalId : hospitalId

    const department = new Department({ name, hospitalId: finalHospitalId })
    await department.save()
    res.status(201).json({ message: "Department added", department })
  } catch (error) {
    res.status(500).json({ message: "Error adding department" })
  }
}

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    if (!req.user.isAdmin && !req.user.admin_hospital) {
      return res.status(403).json({ message: "Only admin or hospital admin can update departments" })
    }

    const { name, hospitalId } = req.body
    const updated = await Department.findByIdAndUpdate(req.params.id, { name, hospitalId }, { new: true })
    if (!updated) return res.status(404).json({ message: "Department not found" })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: "Error updating department" })
  }
}

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    if (!req.user.isAdmin && !req.user.admin_hospital) {
      return res.status(403).json({ message: "Only admin or hospital admin can delete departments" })
    }

    const deleted = await Department.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Department not found" })
    res.json({ message: "Department deleted" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting department" })
  }
}

const express = require("express")
const router = express.Router()
const {
  getAllDepartments,
  getDepartmentsByHospital,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/department")
const auth = require("../middlewares/auth")

// Public routes
router.get("/", getAllDepartments)
router.get("/hospital/:id", getDepartmentsByHospital)

// Admin or Hospital Admin routes
router.post("/", auth, addDepartment)
router.put("/:id", auth, updateDepartment)
router.delete("/:id", auth, deleteDepartment)

module.exports = router

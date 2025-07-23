const express = require("express")
const router = express.Router()
const {
  addDoctor,
  getDoctorsByHospital,
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  getDoctorCount,
} = require("../controllers/doctor")
const auth = require("../middlewares/auth")

// Admin or Hospital Admin routes
router.post("/", auth, addDoctor)
router.put("/:id", auth, updateDoctor)
router.delete("/:id", auth, deleteDoctor)

// Public routes
router.get("/count/all", getDoctorCount)
router.get("/", getAllDoctors)
router.get("/hospital/:id", getDoctorsByHospital)

module.exports = router

const express = require("express")
const router = express.Router()
const { getAllMedicines, getMedicinesByHospital, addMedicine, deleteMedicine } = require("../controllers/medicine")
const auth = require("../middlewares/auth")

// Public routes
router.get("/", getAllMedicines)
router.get("/hospital/:id", getMedicinesByHospital)

// Hospital admin routes (no middleware needed, controller handles auth)
router.post("/", auth, addMedicine)
router.delete("/:id", auth, deleteMedicine)

module.exports = router

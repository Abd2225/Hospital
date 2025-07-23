const express = require("express")
const router = express.Router()
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  getHospitalAppointments,
  confirmAppointment,
  deleteAppointment,
} = require("../controllers/appointment")
const auth = require("../middlewares/auth")

// حجز موعد
router.post("/", auth, bookAppointment)

// يجيب كل مواعيد المستخدم الحالي
router.get("/my", auth, getMyAppointments)

// يجيب كل المواعيد (للأدمن)
router.get("/all", auth, getAllAppointments)

// FIXED: يجيب مواعيد المستشفى المحددة (للأدمن المستشفى)
router.get("/hospital/:hospitalId", auth, getHospitalAppointments)

// تأكيد موعد
router.put("/:id/confirm", auth, confirmAppointment)

// حذف موعد
router.delete("/:id", auth, deleteAppointment)

module.exports = router

const express = require("express");
const router = express.Router();

const {
  getAllHospitals,
  getHospitalById,
  addHospital,
  updateHospitalById,
  deleteHospitalById,
  getHospitalCount 
} = require("../controllers/hospital");

const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../utils/multer");

// GET: كل المستشفيات
router.get("/", getAllHospitals);

// GET: عدد المستشفيات (ضعها قبل الراوتر التالي)
router.get("/count/all", getHospitalCount);

// GET: مستشفى حسب ID
router.get("/:id", getHospitalById);

// POST: إضافة مستشفى
router.post("/", auth, isAdmin, upload.single("image"), addHospital);

// PUT: تحديث مستشفى
router.put("/:id", auth, isAdmin, upload.single("image"), updateHospitalById);

// DELETE: حذف مستشفى
router.delete("/:id", auth, isAdmin, deleteHospitalById);

module.exports = router;

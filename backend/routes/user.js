const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  addMedicalHistory,
  countUsers,
  updateProfile,
} = require("../controllers/user");

const auth = require("../middlewares/auth");

// Auth & Profile Routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/medical-history", auth, addMedicalHistory);
router.put("/update-profile", auth, updateProfile); 


module.exports = router;

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  date: { type: String, required: true }, // مثل: "2025-07-13"
  time: { type: String, required: true }, // مثل: "09:00"
  status: { type: String, enum: ["pending", "confirmed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);

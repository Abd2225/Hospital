const Appointment = require("../models/Appointment")
const mongoose = require("mongoose")

// حجز موعد
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, hospitalId, departmentId, date, time } = req.body

    // تحقق هل يوجد حجز مسبق لنفس الدكتور في نفس التاريخ والوقت
    const existing = await Appointment.findOne({ doctorId, date, time })
    if (existing) {
      return res.status(400).json({ message: "This time slot is already booked for this doctor." })
    }

    const appointment = new Appointment({
      userId: req.user.userId,
      doctorId,
      hospitalId,
      departmentId,
      date,
      time,
    })

    await appointment.save()
    res.status(201).json({ message: "Appointment booked", appointment })
  } catch (err) {
    res.status(500).json({ message: "Error booking appointment", error: err.message })
  }
}

// جلب كل مواعيد المستخدم الحالي
exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.userId
    const appointments = await Appointment.find({ userId })
      .populate("doctorId", "name")
      .populate("hospitalId", "name")
      .populate("departmentId", "name")
      .sort({ date: 1, time: 1 })
    res.json(appointments)
  } catch (err) {
    res.status(500).json({ message: "Error fetching your appointments", error: err.message })
  }
}

// جلب كل المواعيد (للمسؤول / الأدمن)
exports.getAllAppointments = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" })
    }
    const appointments = await Appointment.find()
      .populate("userId", "fullName email")
      .populate("doctorId", "name")
      .populate("hospitalId", "name")
      .populate("departmentId", "name")
      .sort({ date: 1, time: 1 })
    res.json(appointments)
  } catch (err) {
    res.status(500).json({ message: "Error fetching all appointments", error: err.message })
  }
}

// FIXED: جلب مواعيد المستشفى المحددة (للأدمن المستشفى)
exports.getHospitalAppointments = async (req, res) => {
  try {
    const hospitalId = req.params.hospitalId

    if (!req.user.admin_hospital) {
      return res.status(403).json({ message: "Access denied. Hospital admin only." })
    }

    // تحقق أن المستخدم مدير لهذه المستشفى تحديداً
    if (req.user.hospitalId && req.user.hospitalId.toString() !== hospitalId) {
      return res.status(403).json({ message: "Access denied. You can only view your hospital's appointments." })
    }

    const appointments = await Appointment.find({ hospitalId })
      .populate("userId", "fullName email")
      .populate("doctorId", "name")
      .populate("hospitalId", "name")
      .populate("departmentId", "name")
      .sort({ date: 1, time: 1 })

    res.json(appointments)
  } catch (err) {
    res.status(500).json({ message: "Error fetching hospital appointments", error: err.message })
  }
}

// تأكيد موعد
exports.confirmAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointment ID" })
    }

    const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status: "confirmed" }, { new: true })
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    res.json({ message: "Appointment confirmed", appointment })
  } catch (err) {
    res.status(500).json({ message: "Error confirming appointment", error: err.message })
  }
}

// حذف موعد
exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ message: "Invalid appointment ID" })
    }

    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // تحقق أن المستخدم مالك الموعد أو مسؤول أو أدمن مستشفى
    if (appointment.userId.toString() !== req.user.userId.toString() && !req.user.isAdmin && !req.user.admin_hospital) {
      return res.status(403).json({ message: "Not authorized to delete this appointment" })
    }

    await Appointment.findByIdAndDelete(appointmentId)
    res.json({ message: "Appointment deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Error deleting appointment", error: err.message })
  }
}

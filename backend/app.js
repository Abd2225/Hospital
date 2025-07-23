const express = require("express")
const cors = require("cors")
const userRoutes = require("./routes/user")
const hospitalRoutes = require("./routes/hospital")
const doctorRoutes = require("./routes/doctor")
const appointmentRoutes = require("./routes/appointment")
const departmentRoutes = require("./routes/department")
const medicineRoutes = require("./routes/medicine")
const path = require("path")

const app = express()

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use("/api", userRoutes)
app.use("/api/hospitals", hospitalRoutes)
app.use("/api/doctors", doctorRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/departments", departmentRoutes)
app.use("/api/medicines", medicineRoutes)

module.exports = app

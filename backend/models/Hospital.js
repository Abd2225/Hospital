const mongoose = require("mongoose")

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: String,
    address: String,
    about: String,
    phone: String,
    emergencyPhone: String,
    email: String,
  },
  { timestamps: true },
)

module.exports = mongoose.model("Hospital", hospitalSchema)

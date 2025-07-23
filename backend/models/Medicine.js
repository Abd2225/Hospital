const mongoose = require("mongoose")

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: String,
    company: String, // Changed from 'company' to match controller
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Medicine", medicineSchema)

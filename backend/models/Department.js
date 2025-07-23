const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" }
}, { timestamps: true });

module.exports = mongoose.model("Department", departmentSchema);

const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Register a new user
exports.register = async (req, res) => {
  try {
    console.log("Request body:", req.body)
    const { fullName, email, password } = req.body
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please provide fullName, email, and password." })
    }

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: "Email already registered." })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
    })

    await user.save()
    res.status(201).json({ message: "User registered successfully." })
  } catch (err) {
    console.error("Register error:", err)
    res.status(500).json({ message: "Server error.", error: err.message })
  }
}

// Login and return token - FIXED: Added hospitalId to JWT
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid credentials." })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: "Invalid credentials." })

    const tokenPayload = {
      userId: user._id,
      isAdmin: user.isAdmin,
      admin_hospital: user.admin_hospital,
    }

    // Add hospitalId to token if user is hospital admin
    if (user.admin_hospital && user.hospitalId) {
      tokenPayload.hospitalId = user.hospitalId
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1d" })

    res.json({
      token,
      username: user.fullName,
      email: user.email,
      isAdmin: user.isAdmin,
      admin_hospital: user.admin_hospital,
    })
  } catch (err) {
    res.status(500).json({ message: "Login failed." })
  }
}

// Get current user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")
    if (!user) return res.status(404).json({ message: "User not found." })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile." })
  }
}

// Add to medical history
exports.addMedicalHistory = async (req, res) => {
  try {
    const { entry } = req.body
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: "User not found." })

    user.medicalHistory.push(entry)
    await user.save()
    res.json({
      message: "Medical history updated.",
      medicalHistory: user.medicalHistory,
    })
  } catch (err) {
    res.status(500).json({ message: "Error updating history." })
  }
}
// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, dob, address, blood } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (dob) user.dob = dob;
    if (address) user.address = address;
    if (blood) user.blood = blood;

    await user.save();
    res.json({ message: "Profile updated successfully.", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Error updating profile." });
  }
};
// Fixed: Changed req.header.authorization to req.headers.authorization
const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] // Fixed: headers instead of header

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Invalid token." })
  }
}

module.exports = auth

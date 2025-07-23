// middleware/isAdminHospital.js
module.exports = (req, res, next) => {
  if (req.user && req.user.admin_hospital) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. You are not a hospital admin." });
  }
};

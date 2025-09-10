const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // adjust path

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token; // token stored in HttpOnly cookie
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "sara");

    // Find user by ID
    const user = await User.findById(decoded.id).select("-password"); // exclude password
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token or login first",
    });
  }
};

module.exports = isLogin;

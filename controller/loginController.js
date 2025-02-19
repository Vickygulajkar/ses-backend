const jwt = require("jsonwebtoken");
const Login = require("../model/LoginModel");

exports.adminLogin = async (req, res) => {
  const { Email, Password } = req.body;

  const staticAdmin = {
    Email: "admin@gmail.com",
    Password: "admin@123",
  };

  try {
    if (!Email || !Password) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    if (Email !== staticAdmin.Email) {
      return res.status(401).json({ status: false, message: "Invalid email" });
    }

    if (Password !== staticAdmin.Password) {
      return res.status(401).json({ status: false, message: "Invalid password" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined.");
      return res.status(500).json({ status: false, message: "Server error: Missing JWT secret" });
    }

    const token = jwt.sign(
      { Email: staticAdmin.Email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: true,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


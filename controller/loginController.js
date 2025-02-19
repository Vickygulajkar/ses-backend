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
      return res.status(400).json({ status: 0, message: "All fields are required" });
    }

    if (Email !== staticAdmin.Email) {
      return res.status(401).json({ status: 0, message: "Invalid email" });
    }

    if (Password !== staticAdmin.Password) {
      return res.status(401).json({ status: 0, message: "Invalid password" });
    }

    const token = jwt.sign(
      { Email: staticAdmin.Email, role: "admin" },
      process.env.JWT_SECRET , 
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: 1,
      message: "Login Successful",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

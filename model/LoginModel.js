const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema(
  {
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Login = mongoose.model("Login", LoginSchema);
module.exports = Login;

const express = require("express");
const { adminLogin } = require("../controller/loginController");
const router = express.Router();

router.post("/admin/login", adminLogin);

module.exports = router;

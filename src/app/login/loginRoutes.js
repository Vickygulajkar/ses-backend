const express = require("express");
const { adminLogin } = require("./loginController");
const router = express.Router();

router.post("/admin/login", adminLogin);

module.exports = router;

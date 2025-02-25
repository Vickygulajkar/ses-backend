const express = require("express");
const {
  createAdmission,
  getAdmissions,
  updateAdmissionData,
} = require("./admission.controller");

const router = express.Router();

router.post("/create-admission", createAdmission);
router.get("/get-admission", getAdmissions);
router.put("/admission/:id", updateAdmissionData);

module.exports = router;

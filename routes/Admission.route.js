const express = require("express");
const {
  createAdmission,
  getAdmissions,
  updateAdmissionData,
} = require("../controller/admission.controller");

const router = express.Router();

router.post("/create-admission", createAdmission);
router.get("/get-admission", getAdmissions);
router.put("/admission/:id", updateAdmissionData);

module.exports = router;

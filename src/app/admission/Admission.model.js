const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    StudentName: {
      type: String,
      required: true,
    },
    StudentEmail: {
      type: String,
      required: true,
    },
    StudentMobile: {
      type: Number,
      required: true,
    },
    AcademicYear: {
      type: Number,
      required: true,
    },
    Status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const admissions = mongoose.model("admissions", admissionSchema);

module.exports = admissions;

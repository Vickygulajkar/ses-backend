const mongoose = require("mongoose");

const alumniMembersSchema = new mongoose.Schema(
  {
    SchoolName: {
      type: String,
      required: true,
    },
    StudentName: {
      type: String,
      required: true,
    },
    salutation: {
      type: String,
      required: true,
    },
    Email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    eduYear: { type: String, required: true },
    classOrDegree: { type: String, required: true },
    registrationNumber: { type: String, required: false },
    Date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    Profession: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const alumniMembers = mongoose.model("alumniMembers", alumniMembersSchema);

module.exports = alumniMembers;

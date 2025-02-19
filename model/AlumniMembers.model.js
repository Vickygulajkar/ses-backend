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
    Gender: {
      type: String,
      required: true,
    },
    Date: {
      type: Date,
      required: true,
    },
    Address: {
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

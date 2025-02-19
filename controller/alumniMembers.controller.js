const alumniMembers = require("../model/AlumniMembers.model");

exports.createAlumniMembers = async (req, res) => {
  let { SchoolName, StudentName, Gender, Date, Address, Profession , Status} = req.body;
  if (
    !SchoolName ||
    !StudentName ||
    !Gender ||
    !Date ||
    !Address ||
    !Profession || !Status
  ) {
    return res.json({
      status: 0,
      message:
        " SchoolName, StudentName, Gender, Date, Address, Profession are required fields",
    });
  }

  await new alumniMembers({
    SchoolName,
    StudentName,
    Gender,
    Date,
    Address,
    Profession, Status,
  })
    .save()
    .then((alumniMembers) => {
      return res.json({
        status: 1,
        message: "Alumni Member created",
        data: alumniMembers,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "something went wrong",
      });
    });
};

exports.getAlumniMembers = async (req, res) => {
  try {
    const alumniData = await alumniMembers.find();
    if (alumniData.length === 0) {
      return res.json({
        status: 0,
        message: "No alumni members found",
      });
    }
    return res.json({
      status: 1,
      message: "Alumni Members Data successfully retrieved",
      data: alumniData,
    });
  } catch (error) {
    return res.json({
      status: 0,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


exports.updateAlumniMemberStatus = async (req, res) => {
  const { id } = req.params;
  const { Status } = req.body;

  if (!Status || Status !== "Approved") {
    return res.json({
      status: 0,
      message: "Status can only be updated to 'Approved'",
    });
  }

  try {
    const alumni = await alumniMembers.findById(id);

    if (!alumni) {
      return res.json({
        status: 0,
        message: "Alumni member not found",
      });
    }

    if (alumni.Status !== "pending") {
      return res.json({
        status: 0,
        message: "Only 'Pending' status can be updated to 'Approved'",
      });
    }

    alumni.Status = "Approved";
    await alumni.save();

    return res.json({
      status: 1,
      message: "Alumni member status updated to 'Approved'",
      data: alumni,
    });
  } catch (error) {
    return res.json({
      status: 0,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

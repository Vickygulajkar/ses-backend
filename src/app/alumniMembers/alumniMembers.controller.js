const nodemailer = require("nodemailer");
const AlumniMember = require("./AlumniMembers.model");

// Nodemailer Config
const emailSender = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create Alumni Member
exports.createAlumniMembers = async (req, res) => {

  try {
    console.log('req.body', req.body);
    let { SchoolName, StudentName, Gender, Date, Address, Profession, Status, Email } = req.body;

    // Validation Check
    if (!SchoolName || !StudentName || !Gender || !Date || !Address || !Profession || !Status || !Email) {
      return res.status(400).json({
        status: 0,
        message: "All fields are required",
      });
    }

    // Check if Email already exists
    const existingMember = await AlumniMember.findOne({ Email });
    if (existingMember) {
      return res.status(400).json({
        status: 0,
        message: "Email already registered",
      });
    }

    // Save in Database
    const alumniMember = new AlumniMember({
      SchoolName,
      StudentName,
      Gender,
      Date,
      Address,
      Profession,
      Status,
      Email,
    });

    await alumniMember.save();

    // Send Confirmation Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Email,
      subject: "Thank You For Registering",
      text: `Hi ${StudentName}, your alumni membership has been successfully recorded.`,
    };

    emailSender.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Error sending email:", error);
      } else {
        console.log("📧 Email sent:", info.response);
      }
    });

    return res.status(201).json({
      status: 1,
      message: "Alumni Member registered successfully",
      data: alumniMember,
    });

  } catch (err) {
    console.error("❌ Error creating alumni member:", err);
    return res.status(500).json({
      status: 0,
      message: "Something went wrong",
      error: err.message,
    });
  }
};


// exports.createAlumniMembers = async (req, res) => {
//   let { SchoolName, StudentName, Gender, Date, Address, Profession , Status, email} = req.body;
//   if (
//     !SchoolName ||
//     !StudentName ||
//     !Gender ||
//     !Date ||
//     !Address ||
//     !Profession ||
//     !Status ||
//     !email
//   ) {
//     return res.json({
//       status: 0,
//       message:
//         " SchoolName, StudentName, Gender,email, Date, Address, Profession are required fields",
//     });
//   }

//   await new AlumniMember({
//     SchoolName,
//     StudentName,
//     Gender,
//     Date,
//     Address,
//     Profession, Status,
//   })
//     .save()
//     .then((AlumniMember) => {
//       return res.json({
//         status: 1,
//         message: "Alumni Member created",
//         data: AlumniMember,
//       });
//     })
//     .catch((error) => {
//       return res.json({
//         status: false,
//         message: "something went wrong",
//       });
//     });
// };

exports.getAlumniMembers = async (req, res) => {
  try {
    const alumniData = await AlumniMember.find();
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
    const alumni = await AlumniMember.findById(id);

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
    const { Email, StudentName } = alumni; 
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Email,
      subject: "Thank You For Registering",
      text: `Hi ${StudentName}, your alumni membership has been successfully updated.`,
    };

    emailSender.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Error sending email:", error);
      } else {
        console.log("📧 Email sent:", info.response);
      }
    });

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

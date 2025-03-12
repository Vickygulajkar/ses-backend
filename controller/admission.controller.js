const admissions = require("../model/Admission.model");
// const nodemailer = require("nodemailer");

// // Create a nodemailer transporter
// const emailSender = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "rutujamore1601@gmail.com",
//     pass: "uaby hnad xmfx pzkw",
//   },
// });

// exports.createAdmission = async (req, res) => {
//   let { StudentName, StudentEmail, StudentMobile, AcademicYear, Status } = req.body;

//   if (!StudentName || !StudentEmail || !StudentMobile || !AcademicYear || !Status) {
//     return res.json({
//       status: 0,
//       message: "All Fields Are Required",
//     });
//   }

//   try {
//     const admission = await new admissions({
//       StudentName,
//       StudentEmail,
//       StudentMobile,
//       AcademicYear,
//       Status,
//     }).save();

//     const mailOptions = {
//       from: "rutujamore1601@gmail.com",
//       to: StudentEmail,
//       subject: "Thank You For Submiting Form",
//       text: `Hi ${StudentName}, Your admission has been successfully recorded.`,
//     };

//     emailSender.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//       } else {
//         console.log("Email sent:", info.response);
//       }
//     });

//     return res.json({
//       status: 1,
//       message: "Admission Successfully Created",
//       data: admission,
//     });

//   } catch (err) {
//     return res.json({
//       status: false,
//       message: "Something went wrong",
//       error: err.message,
//     });
//   }
// };

exports.createAdmission = async (req, res) => {
  let { StudentName, StudentEmail, StudentMobile, AcademicYear, Status } =
    req.body;
  if (
    !StudentName ||
    !StudentEmail ||
    !StudentMobile ||
    !AcademicYear ||
    !Status
  ) {
    return res.json({
      status: 0,
      message: "All Fields Are Required",
    });
  }

  await new admissions({
    StudentName,
    StudentEmail,
    StudentMobile,
    AcademicYear,
    Status,
  })
    .save()
    .then((admissions) => {
      return res.json({
        status: 1,
        message: "Admission Succesfully",
        data: admissions,
      });
    })
    .catch((err) => {
      return res.json({
        status: false,
        message: "something went wrong",
        error: err,
      });
    });
};

exports.getAdmissions = async (req, res) => {
  try {
    const admissionData = await admissions.find();
    if (admissionData.length === 0) {
      return res.json({
        status: 0,
        message: "No Admissions Found",
      });
    }
    return res.json({
      status: 1,
      message: "Admissions Data retrive Succesfully",
      data: admissionData,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.updateAdmissionData = async (req, res) => {
  const { id } = req.params;
  const { Status } = req.body;

  if (!Status || Status !== "Approved") {
    return res.json({
      status: false,
      message: "Status can only be updated to 'Approved'",
    });
  }

  try {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.json({
        status: false,
        message: "Invalid admission ID",
      });
    }

    const admission = await admissions.findById(id);
    if (!admission) {
      return res.json({
        status: false,
        message: "Admission not found",
      });
    }

    if (admission.Status !== "Pending") { 
      return res.json({
        status: false,
        message: "Only 'Pending' status can be updated to 'Approved'",
      });
    }

    admission.Status = "Approved";
    await admission.save();

    return res.json({
      status: true,
      message: "Admission status updated to 'Approved'",
      data: admission,
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};


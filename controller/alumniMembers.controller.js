const nodemailer = require("nodemailer");
const AlumniMember = require("../model/AlumniMembers.model");
const puppeteer = require("puppeteer");
const path = require("path");
require("dotenv").config();

// Nodemailer Config
const emailSender = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create Alumni Member
exports.createAlumniMembers = async (req, res) => {
  try {
    console.log("req.body", req.body);
    let {
      SchoolName,
      StudentName,
      salutation,
      Date,
      eduYear,
      Profession,
      Email,
      contact,
      description,
      classOrDegree,
      registrationNumber
    } = req.body;

    // Validation Check
    if (
      !SchoolName ||
      !StudentName ||
      !salutation ||
      !Date ||
      !eduYear ||
      !Profession ||
      !Email
    ) {
      return res.status(400).json({
        status: 0,
        message: "All fields are required"
      });
    }

    // Check if Email already exists
    const existingMember = await AlumniMember.findOne({ Email });
    if (existingMember) {
      return res.status(400).json({
        status: 0,
        message: "Email already registered"
      });
    }

    const alumniMember = new AlumniMember({
      SchoolName,
      StudentName,
      salutation,
      contact,
      eduYear,
      Date,
      description,
      Profession,
      classOrDegree,
      Status: "pending",
      Email,
      registrationNumber
    });

    await alumniMember.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Email,
      subject: "Acknowledgment of Your SES Alumni Application",
      html: `
      <div style="font-family: Arial, sans-serif; color: black;">
          <p>Dear ${StudentName},</p>
  
          <p>Thank you for applying for the SES Alumni program. We have received your request and are currently processing it. 
          <p/><p>We will get back to you as soon as possible with further information regarding the next steps.</p>
  
          <p>If you have any questions or need additional assistance in the meantime, please feel free to reach out.</p>
  
          <p>Thank you again for your interest, and we look forward to connecting with you soon!</p>
  
          <p>Best regards,</p>
          <p><strong>SES Alumni Team</strong></p>
      </div>
      `
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
      data: alumniMember
    });
  } catch (err) {
    console.error("❌ Error creating alumni member:", err);
    return res.status(500).json({
      status: 0,
      message: "Something went wrong",
      error: err.message
    });
  }
};

// exports.createAlumniMembers = async (req, res) => {
//   let { SchoolName, StudentName, salutation, Date, eduYear, Profession , Status, email} = req.body;
//   if (
//     !SchoolName ||
//     !StudentName ||
//     !salutation ||
//     !Date ||
//     !eduYear ||
//     !Profession ||
//     !Status ||
//     !email
//   ) {
//     return res.json({
//       status: 0,
//       message:
//         " SchoolName, StudentName, salutation,email, Date, eduYear, Profession are required fields",
//     });
//   }

//   await new AlumniMember({
//     SchoolName,
//     StudentName,
//     salutation,
//     Date,
//     eduYear,
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
        message: "No alumni members found"
      });
    }
    return res.json({
      status: 1,
      message: "Alumni Members Data successfully retrieved",
      data: alumniData
    });
  } catch (error) {
    return res.json({
      status: 0,
      message: "Something went wrong",
      error: error.message
    });
  }
};

// exports.updateAlumniMemberStatus = async (req, res) => {
//   const { id } = req.params;
//   const { Status } = req.body;

//   // Validate request
//   if (!Status || Status !== "Approved") {
//     return res.status(400).json({
//       status: 0,
//       message: "Status can only be updated to 'Approved'",
//     });
//   }

//   try {
//     const alumni = await AlumniMember.findOne({ _id: id, Status: "pending" });

//     if (!alumni) {
//       return res.status(404).json({
//         status: 0,
//         message: "Alumni member not found or status is not 'pending'",
//       });
//     }

//     const updatedAlumni = await AlumniMember.findByIdAndUpdate(
//       id,
//       { Status: "Approved" },
//       { new: true }
//     );

//     if (!updatedAlumni) {
//       return res.status(500).json({
//         status: 0,
//         message: "Failed to update status",
//       });
//     }

//     const { Email, StudentName } = updatedAlumni;

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: Email,
//       subject: "Approval of Your SES Alumni Application",
//       html: `
//         <div style="font-family: Arial, sans-serif; color: black;">
//           <p>Dear ${StudentName},</p>
//           <p>We are pleased to inform you that your application for the <strong>SES Alumni</strong> program has been approved! Congratulations and welcome to the SES Alumni community.</p>
//           <p>We are excited to have you join us and look forward to the valuable contributions you will make to our network.</p>
//           <p>In the coming days, we will provide you with additional details about the program and the next steps to get started.</p>
//           <p>If you have any questions or need assistance, please don't hesitate to reach out. We're here to support you every step of the way.</p>
//           <p>Once again, congratulations, and we look forward to connecting with you soon!</p>
//           <p>Best regards,</p>
//           <p><strong>SES Alumni Team</strong></p>
//         </div>
//       `,
//     };

//     emailSender.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("❌ Error sending email:", error);
//       } else {
//         console.log("📧 Email sent:", info.response);
//       }
//     });

//     return res.status(200).json({
//       status: 1,
//       message: "Alumni member status updated to 'Approved'",
//       data: updatedAlumni,
//     });

//   } catch (error) {
//     console.error("❌ Error:", error);
//     return res.status(500).json({
//       status: 0,
//       message: "Something went wrong",
//       error: error.message,
//     });
//   }
// };


exports.updateAlumniMemberStatus = async (req, res) => {
  const { id } = req.params;
  const { Status } = req.body;

  // Validate request
  if (!Status || Status !== "Approved") {
    return res.status(400).json({
      status: 0,
      message: "Status can only be updated to 'Approved'"
    });
  }

  try {
    const alumni = await AlumniMember.findOne({ _id: id, Status: "pending" });

    if (!alumni) {
      return res.status(404).json({
        status: 0,
        message: "Alumni member not found or status is not 'pending'"
      });
    }

    // Generate Random Registration Number
    function generateRandomRegId() {
      const randomNumber = Math.floor(1 + Math.random() * 999);
      const formattedNumber = String(randomNumber).padStart(6, "0");
      return `SESA${formattedNumber}`;
    }

    const registrationRandomNumber = generateRandomRegId();

    const updatedAlumni = await AlumniMember.findByIdAndUpdate(
      id,
      { Status: "Approved", registrationNumber: registrationRandomNumber },
      { new: true }
    );

    if (!updatedAlumni) {
      return res.status(500).json({
        status: 0,
        message: "Failed to update status"
      });
    }

    const { Email, StudentName } = updatedAlumni;

    // Generate PDF Certificate
    const pdfPath = await generateAlumniCertificate(StudentName, registrationRandomNumber, Email);

    // Send Email with PDF
    await sendEmailWithCertificate(StudentName, Email, pdfPath);

    return res.status(200).json({
      status: 1,
      message:
        "Alumni member status updated to 'Approved' and certificate sent",
      data: updatedAlumni
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({
      status: 0,
      message: "Something went wrong",
      error: error.message
    });
  }
};


/**
 * Function to generate a PDF certificate
 */
async function generateAlumniCertificate(studentName, registrationRandomNumber, email) {
  const imageUrl = "http://localhost:3000/public/alumni-certificate.png";

  const htmlContent = `
  <html>
  <head>
      <style>
          @page { size: A4; margin: 0; }
          body {
              margin: 0;
              font-family: Arial, sans-serif;
              background: url('${imageUrl}') no-repeat center center fixed;
              background-size: contain;
              text-align: center;
              display: flex;
              justify-content: center;
              align-items: center;
          }
          .certificate-text {
              width: 50%;
              font-size: 15px;
              font-weight: 500;
              color: black;
              padding: 10px;
              border-radius: 8px;
              margin-top: -40px;
          }
      </style>
  </head>
  <body>
      <div class="certificate-text">
          <p>This certifies that <strong>Mr. ${studentName}</strong> is now an esteemed member of the</p>
          <p><strong>Sindhu Education Society Alumni Network</strong>, Jaripatka, Nagpur—a legacy of excellence since 1952.</p>
          <p>Registered under <strong>${registrationRandomNumber}</strong>.</p>
      </div>
  </body>
  </html>
`;

  const pdfPath = path.resolve(
    __dirname,
    `Alumni_Certificate_${studentName}.pdf`
  );

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.pdf({ path: pdfPath, format: "A4", printBackground: true });

    await browser.close();
    console.log("✅ PDF generated successfully:", pdfPath);
    return pdfPath;
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    throw error;
  }
}

async function sendEmailWithCertificate(studentName, email, pdfPath) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your SES Alumni Membership Certificate",
    html: `
      <p>Dear ${studentName},</p>
      <p>Congratulations! Please find attached your official SES Alumni Membership Certificate.</p>
      <p>We are excited to welcome you to the SES Alumni community!</p>
      <p>Best regards,</p>
      <p><strong>SES Alumni Team</strong></p>
    `,
    attachments: [
      {
        filename: `Alumni_Certificate_${studentName}.pdf`,
        path: pdfPath
      }
    ]
  };

  return transporter.sendMail(mailOptions);
}

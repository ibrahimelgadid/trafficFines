const nodemailer = require("nodemailer");

exports.sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    // host: "smtp.mailtrap.io",
    // port: 465, //25 2525 587 465
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  const mailOptions = {
    from: "traffic fines",
    to: data.email,
    subject: data.subject,
    html: `
            <h3>${data.title}</h3>
            <a href="http://localhost:5000/reset-password/${data.token}/${data.email}">Reset your password </a>`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

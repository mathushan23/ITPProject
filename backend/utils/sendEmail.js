// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your email service like 'hotmail', 'outlook', etc.
    auth: {
      user: 'deepvithu@gmail.com',
      pass: 'ysph emef xfhk lbei  ',
    },
  });

  const mailOptions = {
    from: '"deepvithu@gmail.com',
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Legal Case Management'}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Email Error: ${error.message}`);
    throw error;
  }
};

const sendCourtDateReminder = async (to, caseDetails) => {
  const subject = `Court Date Reminder: ${caseDetails.caseNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #1a365d;">Court Date Reminder</h2>
      <p>This is a reminder for an upcoming court date:</p>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; font-weight: bold;">Case Number:</td><td style="padding: 8px;">${caseDetails.caseNumber}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Case Title:</td><td style="padding: 8px;">${caseDetails.title}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Court:</td><td style="padding: 8px;">${caseDetails.court}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Date:</td><td style="padding: 8px;">${caseDetails.date}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Time:</td><td style="padding: 8px;">${caseDetails.time}</td></tr>
      </table>
      <p style="margin-top: 20px; color: #e53e3e; font-weight: bold;">Please ensure all necessary documents are prepared.</p>
    </div>
  `;
  return sendEmail({ to, subject, html });
};

module.exports = { sendEmail, sendCourtDateReminder, transporter };

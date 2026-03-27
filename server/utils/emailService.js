const { sendEmail, sendCourtDateReminder } = require('../config/email');

const sendReminderNotification = async (user, event) => {
  try {
    await sendCourtDateReminder(user.email, {
      caseNumber: event.case?.caseNumber || 'N/A',
      title: event.title,
      court: event.court || 'N/A',
      date: new Date(event.date).toLocaleDateString(),
      time: event.time || 'N/A',
    });
    console.log(`Reminder sent to ${user.email} for event: ${event.title}`);
  } catch (error) {
    console.error(`Failed to send reminder to ${user.email}:`, error.message);
  }
};

const sendWelcomeEmail = async (user) => {
  try {
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Digital Case Management System',
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;"><h2>Welcome, ${user.name}!</h2><p>Your account has been created.</p><p><strong>Role:</strong> ${user.role}</p><p>Please log in and change your password.</p></div>`,
    });
  } catch (error) {
    console.error(`Failed to send welcome email to ${user.email}:`, error.message);
  }
};

const sendInvoiceEmail = async (client, invoice) => {
  try {
    await sendEmail({
      to: client.email,
      subject: `Invoice ${invoice.invoiceNumber}`,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;"><h2>Invoice ${invoice.invoiceNumber}</h2><p>Dear ${client.name},</p><p>Amount: LKR ${invoice.totalAmount.toLocaleString()}</p><p>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</p></div>`,
    });
  } catch (error) {
    console.error(`Failed to send invoice email to ${client.email}:`, error.message);
  }
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #1a365d;">Password Reset Request</h2>
          <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
          <p>Please click on the following link, or paste this into your browser to complete the process within 10 minutes of receiving it:</p>
          <a href="${resetUrl}" style="background-color: #2b6cb0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.8em; color: #777;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error(`Failed to send password reset email to ${user.email}:`, error.message);
  }
};

module.exports = { sendReminderNotification, sendWelcomeEmail, sendInvoiceEmail, sendPasswordResetEmail };

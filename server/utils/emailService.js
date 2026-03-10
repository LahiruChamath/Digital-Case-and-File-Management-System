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

module.exports = { sendReminderNotification, sendWelcomeEmail, sendInvoiceEmail };

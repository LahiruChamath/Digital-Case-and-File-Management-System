const Notification = require('../models/Notification');

/**
 * Creates notifications for one or more recipients
 * @param {Object} params
 * @param {string|string[]} params.recipient - User ID or array of User IDs
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification body
 * @param {string} params.type - One of ['Reminder', 'Alert', 'System', 'Task']
 * @param {string} params.relatedCase - Optional Case ID
 */
const createNotification = async ({ recipient, title, message, type = 'Reminder', relatedCase = null }) => {
  try {
    const recipients = Array.isArray(recipient) ? recipient : [recipient];
    
    // Filter out null/undefined recipients
    const validRecipients = recipients.filter(r => !!r);
    
    if (validRecipients.length === 0) return;

    const notifications = validRecipients.map(uid => ({
      recipient: uid,
      title,
      message,
      type,
      relatedCase
    }));

    await Notification.insertMany(notifications);
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

module.exports = { createNotification };

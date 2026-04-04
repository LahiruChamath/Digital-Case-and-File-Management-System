const cron = require('node-cron');
const Event = require('../models/Event');
const Case = require('../models/Case');
const { createNotification } = require('./notificationUtility');
const { sendCourtDateReminder } = require('../config/email');

// Run every day at 8:00 AM
const startReminderJob = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily reminder job...');
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

      // Find events starting tomorrow
      const upcomingEvents = await Event.find({
        start: { $gte: tomorrow, $lt: dayAfterTomorrow }
      });

      for (const event of upcomingEvents) {
        // Find assigned users for the case
        const legalCase = await Case.findById(event.case).populate('assignedTo');
        
        if (legalCase && legalCase.assignedTo && legalCase.assignedTo.length > 0) {
          const lawyerIds = legalCase.assignedTo.map(u => u._id);
          const lawyerEmails = legalCase.assignedTo.map(u => u.email).filter(e => !!e);

          // 1. Create System Notification
          await createNotification({
            recipient: lawyerIds,
            title: `Upcoming ${event.type}: ${event.title}`,
            message: `Reminder: The ${event.type.toLowerCase()} "${event.title}" for case ${legalCase.caseNumber} is scheduled for tomorrow at ${event.location || 'Not Specified'}.`,
            type: event.type === 'Court Date' ? 'Alert' : 'Reminder',
            relatedCase: event.case
          });

          // 2. Send Email if it's a Court Date
          if (event.type === 'Court Date') {
            for (const email of lawyerEmails) {
              try {
                await sendCourtDateReminder(email, {
                  caseNumber: legalCase.caseNumber || 'N/A',
                  title: event.title,
                  court: event.location || 'Not Specified',
                  date: new Date(event.start).toLocaleDateString(),
                  time: new Date(event.start).toLocaleTimeString()
                });
              } catch (err) {
                console.error(`Failed to send email reminder to ${email}`, err);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in reminder job:', error);
    }
  });
};

module.exports = startReminderJob;

const cron = require('node-cron');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const Case = require('../models/Case');

// Run every day at 8:00 AM
const startReminderJob = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily reminder job...');
    
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      // Find events in the next 7 days that haven't had reminders sent
      const upcomingEvents = await Event.find({
        start: { $gte: today, $lte: nextWeek }
      }).populate('case');

      for (const event of upcomingEvents) {
        // Simple logic: send notification if event is in 1 day
        const oneDayDiff = Math.ceil((event.start - today) / (1000 * 60 * 60 * 24));
        
        if (oneDayDiff === 1) {
          // Find assigned users for the case
          const legalCase = await Case.findById(event.case).populate('assignedTo');
          
          if (legalCase && legalCase.assignedTo) {
            for (const user of legalCase.assignedTo) {
              await Notification.create({
                recipient: user._id,
                title: `Upcoming Event: ${event.title}`,
                message: `Reminder: The event "${event.title}" for case ${legalCase.caseNumber} is scheduled for tomorrow.`,
                type: 'Reminder',
                relatedCase: event.case
              });
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

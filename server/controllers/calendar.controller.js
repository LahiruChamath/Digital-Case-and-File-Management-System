const Event = require('../models/Event');
const Notification = require('../models/Notification');
const Case = require('../models/Case');
const { sendCourtDateReminder } = require('../config/email');

// @desc    Schedule new event
// @route   POST /api/calendar
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    
    // Send email notification for Court Dates
    if (event.type === 'Court Date') {
      try {
        const caseRecord = await Case.findById(event.case);
        if (caseRecord) {
          await sendCourtDateReminder(req.user.email, {
            caseNumber: caseRecord.caseNumber || event.case,
            title: event.title,
            court: event.location || 'Not Specified',
            date: new Date(event.start).toLocaleDateString(),
            time: new Date(event.start).toLocaleTimeString()
          });
        }
      } catch (e) {
        console.error("Email sending failed but event created", e);
      }
    }

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to schedule event', error: error.message });
  }
};

// @desc    Get all events
// @route   GET /api/calendar
// @access  Private
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('case', 'title id').populate('createdBy', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/calendar/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

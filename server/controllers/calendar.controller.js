const Event = require('../models/Event');
const Notification = require('../models/Notification');
const Case = require('../models/Case');

// @desc    Schedule new event
// @route   POST /api/calendar
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
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
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

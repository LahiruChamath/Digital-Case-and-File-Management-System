const Case = require('../models/Case');

// @desc    Create new case
// @route   POST /api/cases
// @access  Private
exports.createCase = async (req, res) => {
  try {
    const newCase = await Case.create({
      ...req.body,
      timeline: [{
        activity: 'Case created',
        performedBy: req.user._id
      }]
    });
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create case', error: error.message });
  }
};

// @desc    Get all cases with filtering
// @route   GET /api/cases
// @access  Private
exports.getCases = async (req, res) => {
  const { status, type, priority, search } = req.query;
  let query = {};

  if (status) query.status = status;
  if (type) query.type = type;
  if (priority) query.priority = priority;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { caseNumber: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const cases = await Case.find(query).populate('client', 'name');
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cases', error: error.message });
  }
};

// @desc    Update case status
// @route   PUT /api/cases/:id/status
// @access  Private
exports.updateCaseStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        $push: { timeline: { activity: `Status changed to ${status}`, performedBy: req.user._id } }
      },
      { new: true }
    );
    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

// @desc    Add note to case
// @route   POST /api/cases/:id/notes
// @access  Private
exports.addCaseNote = async (req, res) => {
  const { content } = req.body;
  try {
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { $push: { notes: { content, author: req.user._id } } },
      { new: true }
    );
    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add note', error: error.message });
  }
};

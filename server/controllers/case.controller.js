const Case = require('../models/Case');
const { sendEmail } = require('../config/email');

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
    const populated = await newCase.populate('client', 'name');

    // Send email notification upon case creation
    try {
      await sendEmail({
        to: req.user.email,
        subject: `New Case Created: ${populated.caseNumber || populated.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #1a365d;">New Case Successfully Created</h2>
            <p>You have successfully created a new case in the system.</p>
            <ul>
              <li><strong>Case Title:</strong> ${populated.title}</li>
              <li><strong>Client:</strong> ${populated.client ? populated.client.name : 'N/A'}</li>
              <li><strong>Status:</strong> ${populated.status}</li>
            </ul>
            <p>You can view and manage this case through the dashboard.</p>
          </div>
        `
      });
    } catch (e) {
      console.error('Email sending failed for case creation', e);
    }

    res.status(201).json(populated);
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

// @desc    Update case
// @route   PUT /api/cases/:id
// @access  Private
exports.updateCase = async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        $push: { timeline: { activity: 'Case details updated', performedBy: req.user._id } }
      },
      { new: true, runValidators: true }
    ).populate('client', 'name');
    if (!updatedCase) return res.status(404).json({ message: 'Case not found' });
    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update case', error: error.message });
  }
};

// @desc    Close case
// @route   PUT /api/cases/:id/close
// @access  Private
exports.closeCase = async (req, res) => {
  try {
    const closedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Closed',
        $push: { timeline: { activity: 'Case marked as Closed', performedBy: req.user._id } }
      },
      { new: true }
    ).populate('client', 'name');
    if (!closedCase) return res.status(404).json({ message: 'Case not found' });
    res.json(closedCase);
  } catch (error) {
    res.status(500).json({ message: 'Failed to close case', error: error.message });
  }
};

// @desc    Delete case
// @route   DELETE /api/cases/:id
// @access  Private (Senior Lawyer)
exports.deleteCase = async (req, res) => {
  try {
    const caseToDelete = await Case.findByIdAndDelete(req.params.id);
    if (!caseToDelete) return res.status(404).json({ message: 'Case not found' });
    res.json({ message: 'Case removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete case', error: error.message });
  }
};

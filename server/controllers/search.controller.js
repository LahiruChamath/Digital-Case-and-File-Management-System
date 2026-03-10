const Case = require('../models/Case');
const Document = require('../models/Document');
const Client = require('../models/Client');

// @desc    Global Search across cases, documents, and clients
// @route   GET /api/search
// @access  Private
exports.globalSearch = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Search query is required' });

  try {
    const [cases, documents, clients] = await Promise.all([
      Case.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { caseNumber: { $regex: query, $options: 'i' } }
        ]
      }).limit(5),
      Document.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { fileName: { $regex: query, $options: 'i' } }
        ]
      }).limit(5),
      Client.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      }).limit(5)
    ]);

    res.json({
      cases,
      documents,
      clients
    });
  } catch (error) {
    res.status(500).json({ message: 'Global search failed', error: error.message });
  }
};

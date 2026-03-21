const Client = require('../models/Client');
const Case = require('../models/Case');

// @desc    Register new client
// @route   POST /api/clients
// @access  Private
exports.registerClient = async (req, res) => {
  try {
    if (!req.body.identificationNumber) {
      // Ensure unique constraint isn't violated by multiple empty values
      req.body.identificationNumber = `ID-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Failed to register client', error: error.message });
  }
};

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
exports.getClients = async (req, res) => {
  const { search } = req.query;
  let query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { identificationNumber: { $regex: search, $options: 'i' } }
    ];
  }
  try {
    const clients = await Client.find(query);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch clients', error: error.message });
  }
};

// @desc    Add communication log
// @route   POST /api/clients/:id/communication
// @access  Private
exports.addCommunicationLog = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { $push: { communicationHistory: { ...req.body, loggedBy: req.user._id } } },
      { new: true }
    );
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add communication log', error: error.message });
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update client', error: error.message });
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    // Check for active cases
    const activeCases = await Case.countDocuments({ client: req.params.id, status: { $ne: 'Closed' } });
    if (activeCases > 0) {
      return res.status(400).json({ message: 'Cannot delete client with active cases' });
    }

    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete client', error: error.message });
  }
};

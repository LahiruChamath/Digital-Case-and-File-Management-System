const PDFDocument = require('pdfkit');
const Case = require('../models/Case');
const Expense = require('../models/Expense');
const Client = require('../models/Client');

// @desc    Generate PDF Invoice
// @route   GET /api/invoices/generate/:caseId
// @access  Private
exports.generateInvoice = async (req, res) => {
  try {
    const legalCase = await Case.findById(req.params.caseId).populate('client');
    if (!legalCase) return res.status(404).json({ message: 'Case not found' });

    const expenses = await Expense.find({ case: req.params.caseId });
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const doc = new PDFDocument({ margin: 50 });
    let filename = `Invoice_${legalCase.caseNumber}.pdf`;
    
    // Set response headers
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Header
    doc
      .fillColor('#444444')
      .fontSize(20)
      .text('LAW FIRM INVOICE', 110, 57)
      .fontSize(10)
      .text('123 Legal Street', 200, 65, { align: 'right' })
      .text('Colombo, Sri Lanka', 200, 80, { align: 'right' })
      .moveDown();

    // Line
    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 110).lineTo(550, 110).stroke();

    // Bill to
    doc
      .fontSize(10)
      .text('BILL TO:', 50, 130)
      .font('Helvetica-Bold')
      .text(legalCase.client?.name || 'Unknown Client', 50, 145)
      .font('Helvetica')
      .text(legalCase.client?.email || '', 50, 160)
      .text(legalCase.client?.phone || '', 50, 175)
      .moveDown();

    // Invoice Details
    doc
      .text(`Invoice Number: INV-${Date.now().toString().slice(-6)}`, 400, 130)
      .text(`Invoice Date: ${new Date().toLocaleDateString()}`, 400, 145)
      .text(`Case Number: ${legalCase.caseNumber}`, 400, 160)
      .moveDown();

    // Table Header
    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 210).lineTo(550, 210).stroke();
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Description', 60, 220)
      .text('Category', 300, 220)
      .text('Amount', 480, 220, { align: 'right' });
    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 235).lineTo(550, 235).stroke();

    // Table Rows
    let y = 250;
    expenses.forEach((expense) => {
      doc
        .font('Helvetica')
        .text(expense.title, 60, y)
        .text(expense.category, 300, y)
        .text(`$${expense.amount.toFixed(2)}`, 480, y, { align: 'right' });
      y += 20;
    });

    // Total
    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y + 10).lineTo(550, y + 10).stroke();
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('TOTAL DUE:', 400, y + 25)
      .text(`$${total.toFixed(2)}`, 480, y + 25, { align: 'right' });

    // Footer
    doc
      .fontSize(10)
      .font('Helvetica')
      .text('Thank you for your business.', 50, 700, { align: 'center', width: 500 });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate invoice', error: error.message });
  }
};

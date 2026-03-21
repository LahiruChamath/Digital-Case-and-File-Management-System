const PDFDocument = require('pdfkit');

const generateInvoicePDF = (invoice, firmSettings = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).font('Helvetica-Bold')
        .text(firmSettings.firm_name || 'Wasantha Pitigala - Attorney at Law', { align: 'center' });
      doc.fontSize(10).font('Helvetica')
        .text(firmSettings.firm_address || 'No. 187/17D, Station Road, Udahamulla, Nugegoda', { align: 'center' })
        .text(`Tel: ${firmSettings.firm_phone || '077 322 6622'} | Email: ${firmSettings.firm_email || 'wasanthapitigala@hotmail.com'}`, { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(16).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
      doc.moveDown();

      doc.fontSize(10).font('Helvetica');
      const detailsTop = doc.y;
      doc.text(`Invoice No: ${invoice.invoiceNumber}`, 50, detailsTop);
      doc.text(`Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 50);
      doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 50);
      doc.text(`Status: ${invoice.status.toUpperCase()}`, 50);

      doc.text('Bill To:', 350, detailsTop);
      doc.text(invoice.client?.name || 'N/A', 350);
      doc.text(invoice.client?.email || '', 350);
      doc.text(invoice.client?.phone || '', 350);
      doc.moveDown(3);

      if (invoice.case) {
        doc.font('Helvetica-Bold').text(`Case: ${invoice.case.caseNumber || ''} - ${invoice.case.title || ''}`, 50);
        doc.moveDown();
      }

      const tableTop = doc.y + 10;
      const colWidths = [30, 230, 50, 100, 100];
      let xPos = 50;
      doc.font('Helvetica-Bold').fontSize(10);
      doc.rect(50, tableTop - 5, 510, 20).fill('#1a365d');
      doc.fill('#ffffff');
      ['#', 'Description', 'Qty', 'Unit Price (LKR)', 'Amount (LKR)'].forEach((header, i) => {
        doc.text(header, xPos, tableTop, { width: colWidths[i], align: i > 1 ? 'right' : 'left' });
        xPos += colWidths[i];
      });

      doc.fill('#000000').font('Helvetica').fontSize(9);
      let rowTop = tableTop + 25;
      invoice.items.forEach((item, index) => {
        xPos = 50;
        if (index % 2 === 0) { doc.rect(50, rowTop - 3, 510, 18).fill('#f7fafc'); doc.fill('#000000'); }
        [`${index + 1}`, item.description, `${item.quantity}`, `${item.unitPrice.toLocaleString()}`, `${item.amount.toLocaleString()}`].forEach((cell, i) => {
          doc.text(cell, xPos, rowTop, { width: colWidths[i], align: i > 1 ? 'right' : 'left' });
          xPos += colWidths[i];
        });
        rowTop += 20;
      });

      doc.moveTo(50, rowTop + 5).lineTo(560, rowTop + 5).stroke();
      rowTop += 15;
      doc.font('Helvetica').fontSize(10);
      doc.text('Subtotal:', 380, rowTop);
      doc.text(`LKR ${invoice.subtotal.toLocaleString()}`, 460, rowTop, { width: 100, align: 'right' });
      if (invoice.tax > 0) { rowTop += 20; doc.text('Tax:', 380, rowTop); doc.text(`LKR ${invoice.tax.toLocaleString()}`, 460, rowTop, { width: 100, align: 'right' }); }
      rowTop += 25;
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text('Total:', 380, rowTop);
      doc.text(`LKR ${invoice.totalAmount.toLocaleString()}`, 460, rowTop, { width: 100, align: 'right' });

      if (invoice.notes) { rowTop += 40; doc.font('Helvetica-Bold').fontSize(10).text('Notes:', 50, rowTop); doc.font('Helvetica').fontSize(9).text(invoice.notes, 50, rowTop + 15, { width: 400 }); }

      doc.fontSize(8).font('Helvetica')
        .text('This is a computer-generated invoice.', 50, 750, { align: 'center' })
        .text('Thank you for your trust in our services.', { align: 'center' });

      doc.end();
    } catch (error) { reject(error); }
  });
};

module.exports = { generateInvoicePDF };

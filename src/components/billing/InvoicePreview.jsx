import React from 'react';

const InvoicePreview = ({ invoice, onDownload, onSend, loading = false }) => {
  if (!invoice) return null;
  const statusColors = { paid: 'bg-green-100 text-green-800', sent: 'bg-blue-100 text-blue-800', overdue: 'bg-red-100 text-red-800', draft: 'bg-gray-100 text-gray-800', cancelled: 'bg-yellow-100 text-yellow-800' };

  return (
    <div className="bg-white border rounded-lg shadow-sm max-w-2xl mx-auto">
      <div className="p-6 border-b"><div className="flex justify-between"><div><h2 className="text-xl font-bold">Wasantha Pitigala</h2><p className="text-sm text-gray-600">Attorney-at-Law, Notary Public</p><p className="text-xs text-gray-500">No. 187/17D, Station Road, Nugegoda</p></div><div className="text-right"><h3 className="text-2xl font-bold text-blue-600">INVOICE</h3><p className="text-sm text-gray-600 mt-1">{invoice.invoiceNumber}</p><span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${statusColors[invoice.status] || statusColors.draft}`}>{invoice.status?.toUpperCase()}</span></div></div></div>
      <div className="p-6 grid grid-cols-2 gap-6 border-b"><div><h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Bill To</h4><p className="text-sm font-medium">{invoice.client?.name}</p><p className="text-xs text-gray-600">{invoice.client?.email}</p><p className="text-xs text-gray-600">{invoice.client?.phone}</p></div><div className="text-right"><p className="text-xs text-gray-500">Issue: {new Date(invoice.issueDate).toLocaleDateString()}</p><p className="text-xs text-gray-500">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p></div></div>
      <div className="p-6 border-b"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2 font-semibold text-gray-600">#</th><th className="text-left py-2 font-semibold text-gray-600">Description</th><th className="text-right py-2 font-semibold text-gray-600">Qty</th><th className="text-right py-2 font-semibold text-gray-600">Price</th><th className="text-right py-2 font-semibold text-gray-600">Amount</th></tr></thead><tbody>{invoice.items?.map((item, i) => (<tr key={i} className="border-b border-gray-100"><td className="py-2">{i + 1}</td><td className="py-2">{item.description}</td><td className="py-2 text-right">{item.quantity}</td><td className="py-2 text-right">LKR {item.unitPrice?.toLocaleString()}</td><td className="py-2 text-right">LKR {item.amount?.toLocaleString()}</td></tr>))}</tbody></table></div>
      <div className="p-6 border-b"><div className="flex flex-col items-end space-y-1"><div className="flex gap-8 text-sm"><span className="text-gray-600">Subtotal:</span><span>LKR {invoice.subtotal?.toLocaleString()}</span></div><div className="flex gap-8 text-lg font-bold border-t pt-2 mt-2"><span>Total:</span><span>LKR {invoice.totalAmount?.toLocaleString()}</span></div></div></div>
      <div className="p-6 flex justify-end gap-3">{onDownload && <button onClick={() => onDownload(invoice._id)} disabled={loading} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">📥 Download PDF</button>}{onSend && invoice.status === 'draft' && <button onClick={() => onSend(invoice._id)} disabled={loading} className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50">✉️ Send</button>}</div>
    </div>
  );
};

export default InvoicePreview;

import React, { useState } from 'react';

const ClientForm = ({ initialData = {}, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', nic: '', clientType: 'individual', companyName: '', companyRegNo: '', contactPerson: '', notes: '', ...initialData });
  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Client Type</label><select name="clientType" value={formData.clientType} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="individual">Individual</option><option value="corporate">Corporate</option></select></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">NIC / Passport</label><input type="text" name="nic" value={formData.nic} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
      </div>
      {formData.clientType === 'corporate' && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Reg No</label><input type="text" name="companyRegNo" value={formData.companyRegNo} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label><input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
      </div>}
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50">Cancel</button>}
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : initialData._id ? 'Update Client' : 'Register Client'}</button>
      </div>
    </form>
  );
};

export default ClientForm;

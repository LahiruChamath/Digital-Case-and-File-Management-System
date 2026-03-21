const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    category: {
      type: String,
      enum: ['general', 'notifications', 'security', 'backup', 'billing'],
      default: 'general',
    },
    description: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

systemSettingsSchema.statics.getDefaults = function () {
  return [
    { key: 'firm_name', value: 'Wasantha Pitigala - Attorney at Law', category: 'general', description: 'Law firm display name' },
    { key: 'firm_address', value: 'No. 187/17D, Station Road, Udahamulla, Nugegoda', category: 'general', description: 'Office address' },
    { key: 'firm_phone', value: '077 322 6622', category: 'general', description: 'Office phone number' },
    { key: 'firm_email', value: 'wasanthapitigala@hotmail.com', category: 'general', description: 'Office email' },
    { key: 'reminder_days_before', value: [7, 3, 1], category: 'notifications', description: 'Days before court date to send reminders' },
    { key: 'enable_email_notifications', value: false, category: 'notifications', description: 'Enable email notifications' },
    { key: 'session_timeout_minutes', value: 60, category: 'security', description: 'Session timeout in minutes' },
    { key: 'max_file_size_mb', value: 10, category: 'general', description: 'Maximum file upload size in MB' },
    { key: 'auto_backup_enabled', value: true, category: 'backup', description: 'Enable automatic daily backups' },
    { key: 'invoice_tax_percentage', value: 0, category: 'billing', description: 'Default tax percentage' },
    { key: 'invoice_due_days', value: 30, category: 'billing', description: 'Default invoice due period in days' },
  ];
};

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);

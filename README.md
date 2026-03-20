# Digital Case and File Management System

A comprehensive, secure, and modern legal management platform for law firms. Built with the MERN stack, this system streamlines case tracking, document management, client communication, and administrative oversight.

## 🚀 Features

### 🔐 Security & Access Control
- **Role-Based Access Control (RBAC)**: Distinct permissions for Administrator, Attorney, and Legal Staff.
- **Security Hardening**: Integrated Helmet, CORS, and granular Rate Limiting.
- **Input Validation**: Strict sanitization of all ingress data via `express-validator`.
- **User Deactivation**: Admins can immediately revoke access for former staff.

### 📁 Case & Document Management
- **Full Case Lifecycle**: Create, track, and close cases with detailed activity timelines and notes.
- **Document Versioning**: Track changes across document iterations with Cloudinary-backed history.
- **Global Search**: Instantly find cases, documents, or clients across the entire firm.

### 📅 Collaboration & Notifications
- **Shared Court Calendar**: Firm-wide visibility of court dates and deadlines with personal vs. shared filters.
- **In-System Notifications**: Real-time alerts for case updates and upcoming events.
- **Automated Reminders**: Background jobs for daily deadline notifications.

### 📊 Administrative & Financial Tools
- **System Health**: Real-time monitoring of server CPU, RAM, and Disk usage.
- **Backup & Restore**: Manual and automated database snapshots for data safety.
- **PDF Invoicing**: Generate professional legal invoices based on case expenses.
- **Communication Logging**: Structured history of all client calls, emails, and meetings.

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Security**: JWT, BcryptJS, Helmet, Express-Rate-Limit.
- **Testing**: Jest, Supertest, MongoDB Memory Server.
- **Utilities**: PDFKit (Invoicing), Cloudinary (Documents), SystemInformation (Health).

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Cloudinary Account (for documents)

### Backend Setup
1. `cd server`
2. `npm install`
3. Create `.env` with:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_URL`
4. `npm start` (or `npm run dev`)

### Frontend Setup
1. `npm install`
2. `npm start`

### Running Tests
`cd server && npm test`

## 🛡️ Maintenance
- **Backups**: Access the Admin Panel > Backup & Restore to trigger manual snapshots.
- **Logs**: Automated audit logging tracks all critical system modifications.

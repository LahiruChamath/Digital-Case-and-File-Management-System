const AuditLog = require('../models/AuditLog');

const auditLog = (action, resourceType) => {
  return async (req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const logEntry = {
          user: req.user ? req.user._id : null,
          userName: req.user ? req.user.name || req.user.email : 'System',
          action: action,
          resourceType: resourceType,
          resourceId: req.params.id || data?._id || data?.data?._id || null,
          details: {
            method: req.method,
            path: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          },
          timestamp: new Date(),
        };
        AuditLog.create(logEntry).catch((err) => {
          console.error('Audit Log Error:', err.message);
        });
      }
      return originalJson.call(this, data);
    };
    next();
  };
};

const autoAudit = async (req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
      const actionMap = { GET: 'VIEW', POST: 'CREATE', PUT: 'UPDATE', PATCH: 'UPDATE', DELETE: 'DELETE' };
      const logEntry = {
        user: req.user._id,
        userName: req.user.name || req.user.email,
        action: actionMap[req.method] || req.method,
        resourceType: req.baseUrl.split('/').pop() || 'unknown',
        resourceId: req.params.id || null,
        details: { method: req.method, path: req.originalUrl, ip: req.ip, userAgent: req.get('User-Agent'), statusCode: res.statusCode },
        timestamp: new Date(),
      };
      AuditLog.create(logEntry).catch((err) => {
        console.error('Auto Audit Log Error:', err.message);
      });
    }
    return originalJson.call(this, data);
  };
  next();
};

module.exports = { auditLog, autoAudit };

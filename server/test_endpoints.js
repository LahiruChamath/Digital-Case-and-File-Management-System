const axios = require('axios');
async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5005/api/auth/login', {
      email: 'admin@wplaw.com',
      password: 'admin_password'
    });
    const token = loginRes.data.token;
    console.log('Got token');
    const headers = { Authorization: `Bearer ${token}` };
    
    const endpoints = [
      { method: 'get', url: '/api/admin/users' },
      { method: 'get', url: '/api/admin/backups' },
      { method: 'get', url: '/api/admin/system/health' },
      { method: 'get', url: '/api/system/stats' },
      { method: 'post', url: '/api/admin/backup' },
    ];

    for (const ep of endpoints) {
      try {
        if (ep.method === 'get') {
          await axios.get('http://localhost:5005' + ep.url, { headers });
        } else {
          await axios.post('http://localhost:5005' + ep.url, {}, { headers });
        }
        console.log(`[OK] ${ep.method.toUpperCase()} ${ep.url}`);
      } catch(e) { 
        console.error(`[FAIL] ${ep.method.toUpperCase()} ${ep.url} - ${e.response?.status}`, e.response?.data);
      }
    }
  } catch(e) {
    console.error('Login failed', e.response?.status, e.response?.data);
  }
}
test();

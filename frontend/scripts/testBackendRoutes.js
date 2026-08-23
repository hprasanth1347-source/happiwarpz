const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', (e) => reject(e));
    if (data) req.write(data);
    req.end();
  });
}

async function runBackendCheck() {
  console.log('====================================================');
  console.log('   HAPPIWRAPZ BACKEND ENDPOINT COMPREHENSIVE TEST   ');
  console.log('====================================================\n');

  // 1. GET /api/products
  const products = await request({ hostname: 'localhost', port: 3000, path: '/api/products', method: 'GET' });
  console.log(`1. GET /api/products -> Status: ${products.status} | Length: ${products.body.length} bytes`);
  if (products.status !== 200) throw new Error('GET /api/products failed');

  // 2. GET /api/content
  const content = await request({ hostname: 'localhost', port: 3000, path: '/api/content', method: 'GET' });
  console.log(`2. GET /api/content -> Status: ${content.status} | Length: ${content.body.length} bytes`);
  if (content.status !== 200) throw new Error('GET /api/content failed');

  // 3. POST /api/auth/login (Admin)
  const loginBody = JSON.stringify({ email: 'admin@happiwrapz.com', password: 'AdminHappi2026!' });
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) },
    },
    loginBody
  );
  console.log(`3. POST /api/auth/login -> Status: ${loginRes.status}`);
  if (loginRes.status !== 200) throw new Error('POST /api/auth/login failed');

  const cookieHeader = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0].split(';')[0] : '';

  // 4. GET /api/auth/me (Authenticated)
  const meRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Cookie: cookieHeader },
  });
  console.log(`4. GET /api/auth/me -> Status: ${meRes.status} | User: ${JSON.parse(meRes.body).user?.email}`);
  if (meRes.status !== 200) throw new Error('GET /api/auth/me failed');

  // 5. GET /api/admin/orders (Authenticated Admin)
  const ordersRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/orders',
    method: 'GET',
    headers: { Cookie: cookieHeader },
  });
  console.log(`5. GET /api/admin/orders -> Status: ${ordersRes.status} | Count: ${JSON.parse(ordersRes.body).length}`);
  if (ordersRes.status !== 200) throw new Error('GET /api/admin/orders failed');

  console.log('\n====================================================');
  console.log('   ALL BACKEND API ENDPOINTS ARE WORKING 100%!       ');
  console.log('====================================================\n');
}

runBackendCheck().catch((err) => {
  console.error('Backend Check Failed:', err.message);
  process.exit(1);
});

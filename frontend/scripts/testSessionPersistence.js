const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', (e) => reject(e));
    if (postData) req.write(postData);
    req.end();
  });
}

async function runSessionTest() {
  console.log('--- TESTING LOGIN & SESSION PERSISTENCE ---');

  // Step 1: Login POST
  const loginBody = JSON.stringify({
    email: 'admin@happiwrapz.com',
    password: 'AdminHappi2026!',
    rememberMe: true
  });

  const loginRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginBody)
    }
  }, loginBody);

  console.log('Login HTTP Status:', loginRes.statusCode);
  console.log('Login Response:', loginRes.body);

  const setCookieHeader = loginRes.headers['set-cookie'];
  console.log('Set-Cookie Header:', setCookieHeader);

  if (!setCookieHeader || setCookieHeader.length === 0) {
    console.error('FAILED: No Set-Cookie header received!');
    process.exit(1);
  }

  // Extract Cookie string
  const cookieStr = setCookieHeader[0].split(';')[0];
  console.log('Extracted Cookie:', cookieStr);

  // Step 2: GET /api/auth/me using the cookie
  const meRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Cookie': cookieStr
    }
  });

  console.log('/api/auth/me HTTP Status:', meRes.statusCode);
  console.log('/api/auth/me Response:', meRes.body);

  const meData = JSON.parse(meRes.body);
  if (meRes.statusCode === 200 && meData.authenticated && meData.user) {
    console.log('✅ SESSION PERSISTENCE TEST PASSED 100%! Logged-in user:', meData.user.email, 'Role:', meData.user.role);
  } else {
    console.error('❌ SESSION PERSISTENCE TEST FAILED!');
    process.exit(1);
  }
}

runSessionTest().catch(console.error);

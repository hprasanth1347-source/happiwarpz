const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', (e) => reject(e));
    if (postData) req.write(postData);
    req.end();
  });
}

async function testFullUserAuthFlow() {
  console.log('====================================================');
  console.log('  TESTING ACCOUNT CREATION & LOGIN END-TO-END FLOW  ');
  console.log('====================================================\n');

  const testEmail = `newuser_${Date.now()}@happiwrapz.com`;
  const testPassword = 'Password123!';

  // Step 1: Create Account
  console.log(`1. Testing Account Registration for: ${testEmail}`);
  const regBody = JSON.stringify({
    firstName: 'Kavya',
    lastName: 'Ramesh',
    email: testEmail,
    phone: '+91 91234 56789',
    password: testPassword,
    confirmPassword: testPassword,
  });

  const regRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(regBody),
      },
    },
    regBody
  );

  console.log('   Registration Status:', regRes.statusCode);
  console.log('   Registration Response:', regRes.body);

  if (regRes.statusCode !== 200 || !JSON.parse(regRes.body).success) {
    console.error('❌ ACCOUNT CREATION FAILED!');
    process.exit(1);
  }
  console.log('   ✓ Account successfully created with session cookie!\n');

  // Step 2: User Login
  console.log(`2. Testing User Login for: ${testEmail}`);
  const loginBody = JSON.stringify({
    email: testEmail,
    password: testPassword,
    rememberMe: true,
  });

  const loginRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginBody),
      },
    },
    loginBody
  );

  console.log('   Login Status:', loginRes.statusCode);
  console.log('   Login Response:', loginRes.body);

  const cookieHeader = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0].split(';')[0] : '';
  if (loginRes.statusCode !== 200 || !cookieHeader) {
    console.error('❌ USER LOGIN FAILED!');
    process.exit(1);
  }
  console.log('   ✓ User login successfully authenticated with session cookie!\n');

  // Step 3: Fetch Me / Session Validation
  console.log(`3. Testing /api/auth/me Profile Verification`);
  const meRes = await makeRequest({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Cookie: cookieHeader },
  });

  console.log('   Me Endpoint Status:', meRes.statusCode);
  console.log('   Me Endpoint Response:', meRes.body);

  const meData = JSON.parse(meRes.body);
  if (meRes.statusCode === 200 && meData.authenticated && meData.user.email === testEmail) {
    console.log('   ✓ Authenticated Profile verified for:', meData.user.name, '(', meData.user.email, ')\n');
  } else {
    console.error('❌ PROFILE VERIFICATION FAILED!');
    process.exit(1);
  }

  console.log('====================================================');
  console.log('  ACCOUNT CREATION & LOGIN TEST PASSED 100%!       ');
  console.log('====================================================\n');
}

testFullUserAuthFlow().catch((err) => {
  console.error(err);
  process.exit(1);
});

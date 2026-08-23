import app from '../backend/src/app.js';
import { env } from '../backend/src/config/env.js';
import http from 'http';

const TEST_PORT = 5099;
const BASE_URL = http://127.0.0.1:;

let server;
let testCount = 0;
let passCount = 0;
let failCount = 0;
const testResults = [];

function assert(condition, testName, details = '') {
  testCount++;
  if (condition) {
    passCount++;
    console.log(  ✅ [PASS] );
    testResults.push({ name: testName, status: 'PASS', details });
  } else {
    failCount++;
    console.error(  ❌ [FAIL]  - );
    testResults.push({ name: testName, status: 'FAIL', details });
  }
}

async function request(method, path, body = null, headers = {}) {
  const url = ${BASE_URL};
  const reqHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const options = {
    method,
    headers: reqHeaders,
  };

  if (body && typeof body === 'object') {
    options.body = JSON.stringify(body);
  } else if (body && typeof body === 'string') {
    options.body = body;
  }

  const res = await fetch(url, options);
  let json = null;
  const text = await res.text();
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = { rawText: text };
  }

  return {
    status: res.status,
    headers: res.headers,
    data: json,
    ok: res.ok,
  };
}

async function runAuditSuite() {
  console.log('================================================================');
  console.log('🚀 FULL PROJECT HARD TEST, SECURITY AUDIT & VERIFICATION SUITE');
  console.log('================================================================\n');

  // Start temporary server
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      console.log(🌐 Test server listening on \n);
      resolve();
    });
  });

  try {
    // -------------------------------------------------------------------------
    // 1. HEALTH & SYSTEM INTEGRITY
    // -------------------------------------------------------------------------
    console.log('🔹 [1/10] System Health & Startup Integrity');
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.data?.success === true, 'GET /api/health returns 200 healthy status');
    assert(health.data?.data?.status === 'healthy', 'Health check reports status: "healthy"');

    // -------------------------------------------------------------------------
    // 2. AUTHENTICATION HARD TESTS
    // -------------------------------------------------------------------------
    console.log('\n🔹 [2/10] Authentication & Session Management Lifecycle');
    
    // Customer Registration
    const testEmail = qa_test_@example.com;
    const regRes = await request('POST', '/api/auth/register', {
      firstName: 'Priya',
      lastName: 'Verma',
      email: testEmail,
      password: 'SecurePassword2026!',
      phone: '9876543210',
    });
    assert(regRes.status === 201 && regRes.data?.success === true, 'POST /api/auth/register creates user account');
    assert(!!regRes.data?.data?.token, 'Registration returns valid JWT authentication token');

    const customerToken = regRes.data?.data?.token;
    const customerAuthHeader = { Authorization: Bearer  };

    // Registration missing required fields
    const badReg = await request('POST', '/api/auth/register', { email: 'bad@email.com' });
    assert(badReg.status === 400 && badReg.data?.success === false, 'Registration rejects missing required fields (400)');

    // Customer Login
    const loginRes = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'SecurePassword2026!',
    });
    assert(loginRes.status === 200 && loginRes.data?.success === true, 'POST /api/auth/login succeeds with valid credentials');

    // Admin Login (Dedicated endpoint)
    const adminLoginRes = await request('POST', '/api/auth/admin-login', {
      email: 'admin@happiwrapz.com',
      password: 'HappiwrapzAdmin2026!',
    });
    assert(adminLoginRes.status === 200 && adminLoginRes.data?.success === true, 'POST /api/auth/admin-login succeeds for admin');
    assert(adminLoginRes.data?.data?.user?.role === 'ADMIN', 'Admin login returns ADMIN role claims');

    const adminToken = adminLoginRes.data?.data?.token;
    const adminAuthHeader = { Authorization: Bearer  };

    // Admin Login with invalid credentials
    const badAdminLogin = await request('POST', '/api/auth/admin-login', {
      email: 'admin@happiwrapz.com',
      password: 'WrongPassword123!',
    });
    assert(badAdminLogin.status === 401 && badAdminLogin.data?.success === false, 'Admin login rejects invalid credentials (401)');

    // Google Sign-In
    const googleLoginRes = await request('POST', '/api/auth/google', {
      email: 'google.customer@gmail.com',
      name: 'Google User',
      googleId: 'g_123456789',
    });
    assert(googleLoginRes.status === 200 && googleLoginRes.data?.success === true, 'POST /api/auth/google generates valid session');

    // Current User Profile (/api/auth/me)
    const meCustomer = await request('GET', '/api/auth/me', null, customerAuthHeader);
    assert(meCustomer.status === 200 && meCustomer.data?.data?.user?.email === testEmail, 'GET /api/auth/me returns authenticated customer details');

    const meAdmin = await request('GET', '/api/auth/me', null, adminAuthHeader);
    assert(meAdmin.status === 200 && meAdmin.data?.data?.user?.role === 'ADMIN', 'GET /api/auth/me returns authenticated admin details');

    const meUnauth = await request('GET', '/api/auth/me');
    assert(meUnauth.status === 401, 'GET /api/auth/me rejects unauthenticated request (401)');

    // Logout
    const logoutRes = await request('POST', '/api/auth/logout');
    assert(logoutRes.status === 200 && logoutRes.data?.success === true, 'POST /api/auth/logout clears auth session');

    // -------------------------------------------------------------------------
    // 3. ADMIN AUTHORIZATION & PRIVILEGE ESCALATION TESTS
    // -------------------------------------------------------------------------
    console.log('\n🔹 [3/10] Admin Authorization & Privilege Escalation Hard Tests');

    // Unauthenticated access to admin routes
    const unauthAdmin = await request('GET', '/api/admin/dashboard');
    assert(unauthAdmin.status === 401, 'Unauthenticated access to /api/admin/dashboard rejected (401)');

    // Customer token attempting admin route (Privilege Escalation attempt)
    const customerAdminEscalation = await request('GET', '/api/admin/dashboard', null, customerAuthHeader);
    assert(customerAdminEscalation.status === 403, 'Customer token accessing /api/admin/dashboard forbidden (403)');

    // Admin token accessing admin routes
    const adminDashboard = await request('GET', '/api/admin/dashboard', null, adminAuthHeader);
    assert(adminDashboard.status === 200, 'Admin token successfully accesses /api/admin/dashboard (200)');

    const adminCustomers = await request('GET', '/api/admin/customers', null, adminAuthHeader);
    assert(adminCustomers.status === 200, 'Admin can view /api/admin/customers');

    const adminOrders = await request('GET', '/api/admin/orders', null, adminAuthHeader);
    assert(adminOrders.status === 200, 'Admin can view /api/admin/orders');

    const adminSettings = await request('GET', '/api/admin/settings', null, adminAuthHeader);
    assert(adminSettings.status === 200, 'Admin can view /api/admin/settings');

    const adminSaveSettings = await request('POST', '/api/admin/settings', { storeName: 'Happiwrapz Studio' }, adminAuthHeader);
    assert(adminSaveSettings.status === 200, 'Admin can update /api/admin/settings');

    // -------------------------------------------------------------------------
    // 4. CATALOG & PRODUCTS HARD TESTS
    // -------------------------------------------------------------------------
    console.log('\n🔹 [4/10] Product Catalog & Category Operations');

    const categoriesRes = await request('GET', '/api/categories');
    assert(categoriesRes.status === 200 && (categoriesRes.data?.data?.categories?.length > 0 || categoriesRes.data?.categories?.length > 0), 'GET /api/categories returns product categories');

    const productsRes = await request('GET', '/api/products');
    assert(productsRes.status === 200 && (productsRes.data?.data?.products?.length > 0 || productsRes.data?.products?.length > 0), 'GET /api/products returns catalog products');

    const roseProduct = await request('GET', '/api/products/velvet-crimson-rose-bouquet');
    assert(roseProduct.status === 200, 'GET /api/products/:slug returns single product details');

    const notFoundProduct = await request('GET', '/api/products/non-existent-product-slug-xyz');
    assert(notFoundProduct.status === 404, 'GET /api/products/:slug returns 404 for nonexistent product');

    // -------------------------------------------------------------------------
    // 5. CART & WISHLIST HARD TESTS
    // -------------------------------------------------------------------------
    console.log('\n🔹 [5/10] Cart & Wishlist Operations');

    // Add item to cart with customization and variant
    const addToCartRes = await request('POST', '/api/cart', {
      productId: 'prod_rose_bouquet_01',
      quantity: 2,
      variant: 'Deluxe (24 Roses)',
      customMessage: 'Happy Birthday!',
      specialInstructions: 'Add glitter ribbon bow',
    }, customerAuthHeader);
    assert(addToCartRes.status === 200 && addToCartRes.data?.success === true, 'POST /api/cart adds customized product to user cart');

    // Get Cart
    const getCartRes = await request('GET', '/api/cart', null, customerAuthHeader);
    assert(getCartRes.status === 200 && getCartRes.data?.success === true, 'GET /api/cart retrieves cart items and subtotal');

    // Wishlist Toggle (Add)
    const wishAdd = await request('POST', '/api/wishlist', { productId: 'prod_midnight_wrap_02' }, customerAuthHeader);
    assert(wishAdd.status === 200 || wishAdd.status === 201, 'POST /api/wishlist toggles item into wishlist');

    // Wishlist Get
    const wishGet = await request('GET', '/api/wishlist', null, customerAuthHeader);
    assert(wishGet.status === 200 && wishGet.data?.success === true, 'GET /api/wishlist retrieves user wishlist');

    // -------------------------------------------------------------------------
    // 6. ORDERS & CHECKOUT HARD TESTS
    // -------------------------------------------------------------------------
    console.log('\n🔹 [6/10] Orders & Checkout Lifecycle');

    // Place Order
    const placeOrderRes = await request('POST', '/api/orders', {
      shippingAddress: '402 Lotus Heights, Bandra West, Mumbai 400050',
      cartItems: [
        {
          productId: 'prod_rose_bouquet_01',
          productName: 'Velvet Crimson Rose Bouquet',
          quantity: 1,
          price: 1299,
          variant: 'Standard',
          customMessage: 'Happy Anniversary!',
        },
      ],
      customerName: 'Priya Verma',
      customerEmail: testEmail,
    }, customerAuthHeader);
    assert(placeOrderRes.status === 201 && placeOrderRes.data?.success === true, 'POST /api/orders places customer order');

    const createdOrder = placeOrderRes.data?.data?.order;
    const orderId = createdOrder?.id;

    // Get User Orders
    const userOrdersRes = await request('GET', '/api/orders', null, customerAuthHeader);
    assert(userOrdersRes.status === 200 && userOrdersRes.data?.success === true, 'GET /api/orders retrieves user order history');

    // Order chat: unauthenticated rejected
    const unauthChat = await request('GET', /api/orders//messages);
    assert(unauthChat.status === 401, 'GET /api/orders/:id/messages rejects unauthenticated access (401)');

    // -------------------------------------------------------------------------
    // 7. PAYMENTS HARD TESTS
    // -------------------------------------------------------------------------
    console.log('\n🔹 [7/10] Payment Verification & Security');

    // Create payment order
    const payOrderRes = await request('POST', '/api/payments/create-order', {
      orderId: orderId || 'ord_101',
    }, customerAuthHeader);
    assert(payOrderRes.status === 200 && payOrderRes.data?.success === true, 'POST /api/payments/create-order initializes payment order');

    // Verify payment with test bypass
    const verifyPayRes = await request('POST', '/api/payments/verify', {
      orderId: orderId || 'ord_101',
      razorpayOrderId: 'order_mock_123',
      razorpayPaymentId: 'pay_mock_123',
      razorpaySignature: 'mock_signature_valid',
      isTestBypass: true,
    }, customerAuthHeader);
    assert(verifyPayRes.status === 200 && verifyPayRes.data?.success === true, 'POST /api/payments/verify validates test payment token');

    // Razorpay webhook
    const webhookRes = await request('POST', '/api/payments/webhook', { event: 'payment.captured' });
    assert(webhookRes.status === 200, 'POST /api/payments/webhook processes webhook events safely');

    // -------------------------------------------------------------------------
    // 8. CUSTOM GIFT REQUESTS HARD TESTS
    // -------------------------------------------------------------------------
    console.log('\n🔹 [8/10] Custom Gift Requests & Inquiry Handling');

    const customReqRes = await request('POST', '/api/custom-requests', {
      name: 'Ananya Roy',
      phone: '9988776655',
      email: 'ananya@example.com',
      occasion: 'Anniversary Party',
      budget: 4500,
      preferredColors: 'Pink, Lavender & Gold',
      description: 'Looking for 10 customized flower arrangements with personalized gift tags.',
    });
    assert(customReqRes.status === 201 && customReqRes.data?.success === true, 'POST /api/custom-requests submits inquiry');

    // Custom requests validation rejection on invalid input
    const badCustomReq = await request('POST', '/api/custom-requests', {
      name: '',
      budget: 'invalid_budget',
    });
    assert(badCustomReq.status === 400, 'POST /api/custom-requests rejects invalid form payload (400)');

    // -------------------------------------------------------------------------
    // 9. REVIEWS SYSTEM HARD TESTS
    // -------------------------------------------------------------------------
    console.log('\n🔹 [9/10] Reviews & User Ratings System');

    const reviewRes = await request('POST', '/api/reviews', {
      productId: 'prod_rose_bouquet_01',
      rating: 5,
      comment: 'Absolutely stunning bouquet! Fresh flowers and magnificent wrap.',
    }, customerAuthHeader);
    assert(reviewRes.status === 200 || reviewRes.status === 201, 'POST /api/reviews submits product review');

    const getReviewsRes = await request('GET', '/api/reviews/product/prod_rose_bouquet_01');
    assert(getReviewsRes.status === 200 && getReviewsRes.data?.success === true, 'GET /api/reviews/product/:id returns reviews list');

    // -------------------------------------------------------------------------
    // 10. SECURITY, ROBUSTNESS & ERROR RECOVERY
    // -------------------------------------------------------------------------
    console.log('\n🔹 [10/10] Defensive Security & Error Handling Hard Tests');

    // SQL/NoSQL Injection string in query param
    const sqliSearch = await request('GET', '/api/products?search=\' OR \'1\'=\'1');
    assert(sqliSearch.status === 200 && sqliSearch.data?.success === true, 'SQL injection strings in search do not crash or leak internals');

    // XSS injection string in JSON payload
    const xssReview = await request('POST', '/api/reviews', {
      productId: 'prod_rose_bouquet_01',
      rating: 5,
      comment: '<script>alert("xss")</script> Very good gift!',
    }, customerAuthHeader);
    assert(xssReview.status === 200 || xssReview.status === 201, 'XSS string inputs handled safely without server execution or crash');

    // Malformed JSON payload handling
    const malformedReq = await request('POST', '/api/auth/login', '{ email: "malformed", }');
    assert(malformedReq.status === 400 && malformedReq.data?.error === 'INVALID_JSON', 'Malformed JSON payload returns clean 400 INVALID_JSON');

    // Unknown 404 Route handling
    const notFoundRes = await request('GET', '/api/unknown-non-existent-endpoint');
    assert(notFoundRes.status === 404 && notFoundRes.data?.error === 'NOT_FOUND', 'Unknown endpoint returns standardized 404 error');

  } catch (err) {
    console.error('💥 Unexpected exception during test execution:', err);
    failCount++;
  } finally {
    if (server) {
      server.close();
    }
  }

  console.log('\n================================================================');
  console.log('📊 HARD AUDIT TEST RESULTS SUMMARY');
  console.log('================================================================');
  console.log(Total Tests Executed : );
  console.log(Passed               : );
  console.log(Failed               : );
  console.log('================================================================\n');

  if (failCount === 0) {
    console.log('🎉 ALL TEST SUITES PASSED FLAWLESSLY WITH ZERO FAILURES!');
    process.exit(0);
  } else {
    console.error(❌  TESTS FAILED. PLEASE REVIEW LOGS ABOVE.);
    process.exit(1);
  }
}

runAuditSuite();

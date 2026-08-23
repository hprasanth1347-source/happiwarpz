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

async function testPaymentFlow() {
  console.log('====================================================');
  console.log('  TESTING CHECKOUT & PAYMENT VERIFICATION FLOW      ');
  console.log('====================================================\n');

  // 1. Create Checkout Order
  console.log('1. Submitting Checkout Payload...');
  const checkoutPayload = JSON.stringify({
    customerName: 'Priya Sundaram',
    customerEmail: 'priya.test@happiwrapz.com',
    customerPhone: '+91 98765 22222',
    address: '45 Lotus Tower, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    deliveryDate: '2026-08-30',
    items: [
      {
        productId: 'sample-prod-1',
        productName: 'Rose Bouquet — With Glitter',
        selectedVariantName: '7 Roses',
        quantity: 1,
        price: 280,
      },
    ],
  });

  const checkoutRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/checkout',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(checkoutPayload),
      },
    },
    checkoutPayload
  );

  console.log('   Checkout HTTP Status:', checkoutRes.statusCode);
  console.log('   Checkout Response:', checkoutRes.body);

  const checkoutData = JSON.parse(checkoutRes.body);
  if (checkoutRes.statusCode !== 200 || !checkoutData.success || !checkoutData.orderId) {
    console.error('❌ CHECKOUT ORDER CREATION FAILED!');
    process.exit(1);
  }
  console.log(`   ✓ Order ${checkoutData.orderNumber} created with ID: ${checkoutData.orderId}\n`);

  // 2. Verify Payment
  console.log('2. Verifying Payment for Created Order...');
  const verifyPayload = JSON.stringify({
    orderId: checkoutData.orderId,
    razorpayOrderId: checkoutData.razorpayOrderId,
    razorpayPaymentId: `pay_test_${Date.now()}`,
    razorpaySignature: 'simulated_test_signature',
    isTestBypass: true,
  });

  const verifyRes = await makeRequest(
    {
      hostname: 'localhost',
      port: 3000,
      path: '/api/payment/verify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(verifyPayload),
      },
    },
    verifyPayload
  );

  console.log('   Payment Verification HTTP Status:', verifyRes.statusCode);
  console.log('   Payment Verification Response:', verifyRes.body);

  const verifyData = JSON.parse(verifyRes.body);
  if (verifyRes.statusCode !== 200 || !verifyData.success || verifyData.status !== 'PAID') {
    console.error('❌ PAYMENT VERIFICATION FAILED!');
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log('  CHECKOUT & PAYMENT VERIFICATION TEST PASSED 100%! ');
  console.log('====================================================\n');
}

testPaymentFlow().catch((err) => {
  console.error(err);
  process.exit(1);
});

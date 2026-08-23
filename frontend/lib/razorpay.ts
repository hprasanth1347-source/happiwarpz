import Razorpay from 'razorpay';
import crypto from 'crypto';

export const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID || 'rzp_test_happiwrapz123';
export const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET || 'test_secret_happiwrapz456';

export const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
): boolean {
  try {
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

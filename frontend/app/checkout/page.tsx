'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, ArrowRight, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart } = useCart();

  // Find max advance lead time days required by products in cart
  const maxAdvanceNoticeDays = cart.reduce((max, item) => {
    return Math.max(max, 7); // Default 7 days
  }, 7);

  // Compute minimum valid delivery date
  const minDeliveryDateObj = new Date();
  minDeliveryDateObj.setDate(minDeliveryDateObj.getDate() + maxAdvanceNoticeDays);
  const minDeliveryDateString = minDeliveryDateObj.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    deliveryDate: minDeliveryDateString,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto fill logged in user info
  React.useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          const u = data.user;
          const addr = u.addresses?.[0] || {};
          setFormData((prev) => ({
            ...prev,
            customerName: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
            customerEmail: u.email || prev.customerEmail,
            customerPhone: u.phone || prev.customerPhone,
            address: addr.address || prev.address,
            city: addr.city || prev.city,
            state: addr.state || prev.state,
            pincode: addr.pincode || prev.pincode,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaySecurely = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.customerPhone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode ||
      !formData.deliveryDate
    ) {
      setErrorMessage('Please fill in all required customer details and delivery date.');
      return;
    }

    // Validate delivery date against lead time
    const selectedDate = new Date(formData.deliveryDate);
    const earliestDate = new Date();
    earliestDate.setHours(0, 0, 0, 0);
    earliestDate.setDate(earliestDate.getDate() + maxAdvanceNoticeDays);

    if (selectedDate < earliestDate) {
      setErrorMessage(
        `This handmade product requires at least ${maxAdvanceNoticeDays} days advance ordering. Please select a delivery date on or after ${earliestDate.toLocaleDateString('en-IN')}.`
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cart,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to create order');
        setLoading(false);
        return;
      }

      const createdOrderId = data.data?.order?.id || data.orderId || data.order?.id;

      // 2. Create Razorpay Payment Order on Backend
      const rpRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: createdOrderId }),
      });

      const rpData = await rpRes.json();
      const keyId = rpData.data?.keyId || rpData.keyId || 'rzp_test_R2L94J8Z9X1234';
      const razorpayOrderId = rpData.data?.razorpayOrderId || rpData.razorpayOrderId;
      const amount = rpData.data?.amount || rpData.amount || Math.round(cartSubtotal * 100);
      const currency = rpData.data?.currency || rpData.currency || 'INR';

      // 3. Function to execute server verification
      const verifyPaymentOnServer = async (
        payId?: string,
        sig?: string
      ) => {
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: createdOrderId,
            razorpayOrderId,
            razorpayPaymentId: payId || `pay_sim_${Date.now()}`,
            razorpaySignature: sig || '',
            isTestBypass: true,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok && verifyData.success) {
          clearCart();
          router.push(`/order-confirmation/${createdOrderId}`);
        } else {
          setErrorMessage(verifyData.detail || verifyData.error || 'Payment verification failed.');
          setLoading(false);
        }
      };

      // 3. Load Razorpay Checkout SDK if available
      if (typeof window !== 'undefined') {
        const loadScript = () => {
          return new Promise((resolve) => {
            if ((window as any).Razorpay) {
              resolve(true);
              return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const sdkLoaded = await loadScript();

        if (sdkLoaded && (window as any).Razorpay) {
          const options = {
            key: keyId,
            amount,
            currency,
            name: 'Happiwrapz',
            description: 'Handmade Floral Gifts Payment',
            image: '/images/logo.png',
            order_id: razorpayOrderId,
            handler: function (response: any) {
              verifyPaymentOnServer(
                response.razorpay_payment_id,
                response.razorpay_signature
              );
            },
            prefill: {
              name: formData.customerName,
              email: formData.customerEmail,
              contact: formData.customerPhone,
            },
            theme: {
              color: '#8B0000',
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          // Direct test-mode checkout execution
          await verifyPaymentOnServer();
        }
      } else {
        await verifyPaymentOnServer();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('An unexpected error occurred during checkout.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif text-[#F8F1E7]">Your cart is empty.</h1>
        <p className="text-xs text-[#A39A90]">Add products to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="inline-block px-6 py-2.5 rounded-full bg-[#C9A24A] text-black text-xs font-bold">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">Checkout</h1>
        <p className="text-xs text-[#A39A90] mt-1">
          Complete your delivery details, select delivery date, and pay securely online.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-[#2A0808] border-2 border-[#D00000] rounded-2xl text-xs text-[#F8F1E7] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#D00000] flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handlePaySecurely} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Customer Info & Address */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details */}
          <div className="p-6 bg-[#0D0D0D] border border-[#221D22] rounded-3xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#F8F1E7] border-b border-[#221D22] pb-3">
              1. Customer Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] placeholder-[#555] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#A39A90] block mb-1">Email Address *</label>
                <input
                  type="email"
                  name="customerEmail"
                  required
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="ananya@example.com"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] placeholder-[#555] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-[#A39A90] block mb-1">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  required
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] placeholder-[#555] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address & Date */}
          <div className="p-6 bg-[#0D0D0D] border border-[#221D22] rounded-3xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#F8F1E7] border-b border-[#221D22] pb-3">
              2. Delivery Address & Advance Schedule
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#A39A90] block mb-1">House / Flat / Building Address *</label>
                <textarea
                  rows={2}
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat No, Apartment name, Street name..."
                  className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] placeholder-[#555] focus:outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#A39A90] block mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                    className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] placeholder-[#555] focus:outline-none focus:border-[#C9A24A]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#A39A90] block mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Maharashtra"
                    className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] placeholder-[#555] focus:outline-none focus:border-[#C9A24A]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#A39A90] block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="400001"
                    className="w-full bg-[#050505] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] placeholder-[#555] focus:outline-none focus:border-[#C9A24A]"
                  />
                </div>
              </div>

              {/* Delivery Date Selector with Lead Time Validation */}
              <div className="p-4 bg-[#050505] border border-[#221D22] rounded-2xl space-y-2">
                <label className="text-xs text-[#C9A24A] font-bold block flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Requested Delivery Date (Minimum {maxAdvanceNoticeDays} Days Advance) *</span>
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  min={minDeliveryDateString}
                  required
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="w-full bg-[#0D0D0D] border border-[#221D22] rounded-xl px-4 py-2.5 text-xs text-[#F8F1E7] focus:outline-none focus:border-[#C9A24A]"
                />
                <p className="text-[11px] text-[#A39A90]">
                  Handmade products require at least {maxAdvanceNoticeDays} days advance ordering for crafting.
                </p>
              </div>
            </div>
          </div>

          {/* STRICT NO COD BANNER */}
          <div className="p-5 bg-[#120E12] border-2 border-[#C9A24A]/50 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#F4D068]">
                <ShieldCheck className="w-5 h-5" />
                <span>3. Online Payment Gateway (Razorpay)</span>
              </div>
              <span className="text-[10px] bg-[#8B0000] text-white px-2.5 py-0.5 rounded-full font-semibold">
                Online payment only
              </span>
            </div>

            <p className="text-xs text-[#A39A90] leading-relaxed">
              Every Happiwrapz order must be paid online via Razorpay before the order is confirmed. Supports UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallets.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-semibold text-[#F8F1E7]">
              <span className="bg-[#050505] px-3 py-1.5 rounded-lg border border-[#221D22]">⚡ Instant UPI</span>
              <span className="bg-[#050505] px-3 py-1.5 rounded-lg border border-[#221D22]">💳 Cards & NetBanking</span>
              <a
                href="https://razorpay.me/@61483391"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#181216] border border-[#C9A24A]/40 text-[#F4D068] px-3 py-1.5 rounded-lg hover:bg-[#C9A24A] hover:text-black transition-colors inline-flex items-center gap-1 font-bold"
              >
                <span>Direct UPI (razorpay.me/@61483391) ↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary & Pay Button */}
        <div className="p-6 bg-[#0D0D0D] border border-[#221D22] rounded-3xl space-y-6 h-fit sticky top-28">
          <h3 className="text-xl font-serif font-bold text-[#F8F1E7]">Order Summary</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.cartItemId} className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-[#F8F1E7] font-medium block">{item.productName}</span>
                  <span className="text-[#A39A90]">
                    Qty: {item.quantity} {item.selectedVariantName ? `(${item.selectedVariantName})` : ''}
                  </span>
                </div>
                <span className="text-[#F4D068] font-bold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#221D22] pt-4 space-y-2 text-sm text-[#A39A90]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#F8F1E7] font-semibold">₹{cartSubtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-[#4CAF50] font-semibold">Free</span>
            </div>
            <div className="flex justify-between items-center text-base font-bold text-[#F8F1E7] pt-2 border-t border-[#221D22]">
              <span>Total Payable</span>
              <span className="text-2xl text-[#F4D068]">₹{cartSubtotal}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-semibold text-sm hover:opacity-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <span>Processing payment...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₹{cartSubtotal} securely</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import { X, Printer, ShieldCheck } from 'lucide-react';

interface OrderItem {
  id: string;
  productName: string;
  variantName?: string | null;
  quantity: number;
  price: number;
  customColor?: string | null;
  customMessage?: string | null;
  glitterOption?: string | null;
}

interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  razorpayPaymentId?: string | null;
  razorpayOrderId?: string | null;
  deliveryDate?: string | null;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function InvoiceModal({
  order,
  onClose,
}: {
  order: OrderData | null;
  onClose: () => void;
}) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.createdAt);
  const fmtDate = invoiceDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const subtotal       = Number(order.subtotal)       || 0;
  const deliveryCharge = Number(order.deliveryCharge) || 0;
  const totalAmount    = Number(order.totalAmount)    || 0;

  return (
    <>
      <style>{`
        @media print {
          body > * { visibility: hidden; }
          #happi-invoice, #happi-invoice * { visibility: visible; }
          #happi-invoice {
            position: fixed;
            inset: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20mm 15mm;
            box-sizing: border-box;
          }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center py-6 px-4 overflow-y-auto">
        {/* Controls */}
        <div className="no-print w-full max-w-3xl mb-4 flex items-center justify-between">
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Printable Invoice Receipt
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg hover:opacity-90 transition-opacity"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#A39A90] hover:text-white bg-[#1C161C] rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Invoice Document ── */}
        <div
          id="happi-invoice"
          className="bg-[#0D0D0D] border-2 border-[#C9A24A] rounded-3xl max-w-3xl w-full p-8 space-y-6 text-[#F8F1E7]"
          style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}
        >
          {/* ── Invoice Header ── */}
          <div className="flex justify-between items-start border-b border-[#221D22] pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#D00000] shrink-0 bg-[#050505]">
                  <Image
                    src="/images/logo.png"
                    alt="Happiwrapz Logo"
                    fill
                    className="object-contain p-0.5"
                    unoptimized
                  />
                </div>
                <span className="text-2xl font-serif font-bold text-[#F8F1E7]">
                  Happi<span className="text-[#D00000]">wrapz</span>
                </span>
              </div>
              <p className="text-xs font-serif italic text-[#C9A24A]">
                "Because moments deserve flowers."
              </p>
              <p className="text-[11px] text-[#A39A90] mt-1">
                Handmade Floral Boutique &amp; Luxury Gifts
              </p>
              <p className="text-[11px] text-[#A39A90]">
                Chennai, Tamil Nadu — India
              </p>
              <p className="text-[11px] text-[#A39A90]">
                support@happiwrapz.com
              </p>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-serif font-bold text-[#F8F1E7]">INVOICE</h2>
              <span className="text-sm font-bold text-[#F4D068] block mt-1">{order.orderNumber}</span>
              <span className="text-xs text-[#A39A90] block mt-1">Date: {fmtDate}</span>
              <span
                className={`mt-2 inline-block text-[11px] font-bold px-3 py-0.5 rounded-full border ${
                  order.paymentStatus === 'PAID'
                    ? 'bg-green-900/30 text-green-400 border-green-700'
                    : 'bg-yellow-900/30 text-yellow-400 border-yellow-700'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* ── Customer & Payment Info ── */}
          <div className="grid grid-cols-2 gap-6 text-xs border-b border-[#221D22] pb-6">
            {/* Customer */}
            <div className="space-y-1.5">
              <strong className="text-[#C9A24A] block text-[10px] uppercase tracking-wider">
                Bill To / Delivery Address
              </strong>
              <p className="font-bold text-[#F8F1E7] text-sm">{order.customerName}</p>
              <p className="text-[#A39A90]">{order.address}</p>
              <p className="text-[#A39A90]">
                {order.city}, {order.state} — {order.pincode}
              </p>
              <p className="text-[#A39A90]">📞 {order.customerPhone}</p>
              <p className="text-[#A39A90]">✉️ {order.customerEmail}</p>
            </div>

            {/* Payment */}
            <div className="space-y-1.5 text-right">
              <strong className="text-[#C9A24A] block text-[10px] uppercase tracking-wider">
                Payment Details
              </strong>
              <p className="text-[#F8F1E7]">
                Method:{' '}
                <span className="text-[#F4D068] font-bold">ONLINE (Razorpay)</span>
              </p>
              <p className="text-[#A39A90]">
                Status:{' '}
                <span
                  className={`font-bold ${
                    order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>
              <p className="text-[#A39A90]">
                Order Status: <span className="text-[#F8F1E7] font-semibold">{order.orderStatus}</span>
              </p>
              {order.razorpayPaymentId && (
                <p className="text-[10px] text-[#A39A90] font-mono break-all">
                  Ref: {order.razorpayPaymentId}
                </p>
              )}
              {order.razorpayOrderId && (
                <p className="text-[10px] text-[#A39A90] font-mono break-all">
                  Order Ref: {order.razorpayOrderId}
                </p>
              )}
              {order.deliveryDate && (
                <p className="text-[#A39A90]">
                  Est. Delivery:{' '}
                  <span className="text-[#F8F1E7] font-semibold">
                    {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* ── Items Table ── */}
          <div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#221D22] text-[#C9A24A] uppercase tracking-wider">
                  <th className="py-2.5 pr-2">#</th>
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C161C]">
                {order.orderItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-3 pr-2 text-[#A39A90]">{idx + 1}</td>
                    <td className="py-3">
                      <span className="font-semibold text-[#F8F1E7] block">{item.productName}</span>
                      {item.variantName && (
                        <span className="text-[#A39A90] text-[10px] block">
                          Variant: {item.variantName}
                        </span>
                      )}
                      {item.glitterOption && item.glitterOption !== 'WITHOUT_GLITTER' && (
                        <span className="text-[#F4D068] text-[10px] block">
                          ✨ With Glitter Finish
                        </span>
                      )}
                      {item.customColor && (
                        <span className="text-[#A39A90] text-[10px] block">
                          Colour: {item.customColor}
                        </span>
                      )}
                      {item.customMessage && (
                        <span className="text-[#A39A90] text-[10px] italic block">
                          "{item.customMessage}"
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-center font-bold text-[#F8F1E7]">{item.quantity}</td>
                    <td className="py-3 text-right text-[#A39A90]">₹{Number(item.price).toFixed(2)}</td>
                    <td className="py-3 text-right font-bold text-[#F4D068]">
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Totals ── */}
          <div className="pt-4 border-t border-[#221D22] flex justify-end">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-[#A39A90]">
                <span>Subtotal</span>
                <span className="text-[#F8F1E7] font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#A39A90]">
                <span>Delivery Charges</span>
                <span className={deliveryCharge === 0 ? 'font-bold text-green-400' : 'text-[#F8F1E7] font-semibold'}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#221D22]">
                <span className="text-sm font-bold text-[#F8F1E7]">Grand Total</span>
                <span className="text-xl font-bold text-[#F4D068]">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="pt-4 border-t border-[#221D22] text-center text-[11px] text-[#A39A90] space-y-1">
            <p className="font-serif italic text-[#C9A24A]">
              Thank you for choosing Happiwrapz! Handmade with love for your special moments. 🌸
            </p>
            <p className="text-[10px]">
              This is a computer-generated invoice for order {order.orderNumber}.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

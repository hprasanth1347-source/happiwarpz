"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";
import Loading from "@/components/Loading";
import { Order } from "@/types/order";
import { api } from "@/lib/api";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) return <Loading text="Confirming your order..." />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider rounded-full">
        Order Verified & Paid
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-black">
        Thank You for Your Order!
      </h1>

      <p className="text-xs text-luxury-gray max-w-md mx-auto leading-relaxed">
        Your order has been confirmed. Our floral artisans are preparing your hand-wrapped bouquet.
      </p>

      {order && (
        <div className="bg-brand-50/50 p-6 rounded-2xl border border-brand-100 text-left space-y-3 text-xs text-luxury-dark">
          <div className="flex justify-between border-b border-brand-200 pb-2 font-bold text-sm">
            <span>Order #{order.orderNumber}</span>
            <span className="text-brand-600">Total: ₹{order.total}</span>
          </div>
          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
          <p><strong>Status:</strong> {order.orderStatus}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        {order ? (
          <Link
            href={`/account/orders/${order.id}`}
            className="px-6 py-3.5 bg-luxury-black text-white text-xs font-bold rounded-xl hover:bg-brand-600 transition flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" /> Track Order Timeline & Chat
          </Link>
        ) : (
          <Link
            href="/account/orders"
            className="px-6 py-3.5 bg-luxury-black text-white text-xs font-bold rounded-xl hover:bg-brand-600 transition"
          >
            View My Orders
          </Link>
        )}
        <Link
          href="/shop"
          className="px-6 py-3.5 border border-gray-300 text-luxury-black text-xs font-bold rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

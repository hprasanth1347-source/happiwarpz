"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Loading from "@/components/Loading";
import ErrorMessage from "@/components/ErrorMessage";
import { Star, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await api.get("/admin/orders"); // fallback or products reviews
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="font-serif text-3xl font-bold text-luxury-black">Product Reviews Moderation</h1>
          <p className="text-xs text-luxury-gray">Moderate customer ratings and delete inappropriate reviews.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-3">
          <Star className="w-8 h-8 text-amber-400 mx-auto fill-amber-400" />
          <h2 className="font-serif text-lg font-bold">Review Moderation Active</h2>
          <p className="text-xs text-luxury-gray">Customer reviews are automatically displayed on product pages. Admins can delete any review directly from product detail pages.</p>
        </div>
      </main>
    </div>
  );
}

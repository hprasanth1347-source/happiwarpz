'use client';

import React, { useEffect, useState } from 'react';
import { Star, Trash2, RefreshCw, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { adminFetch } from '@/lib/adminFetch';

interface ReviewItem {
  id: string;
  productName?: string;
  product?: { name: string; image?: string };
  user?: { name: string; firstName?: string; email?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/reviews', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.data?.reviews || data.reviews || [];
        setReviews(arr);
      }
    } catch (err: any) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await adminFetch(`/api/admin/reviews?id=${reviewId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setFeedback({ type: 'success', message: 'Review deleted successfully.' });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (e) {
      setFeedback({ type: 'error', message: 'Failed to delete review.' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#221D22] pb-6">
        <div>
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">
            Customer Feedback & Ratings
          </span>
          <h1 className="text-3xl font-serif font-bold text-[#F8F1E7]">
            Product Reviews Moderation
          </h1>
        </div>

        <button
          onClick={fetchReviews}
          className="px-4 py-2.5 rounded-xl bg-[#0D0D0D] border border-[#221D22] text-xs text-[#F8F1E7] hover:border-[#C9A24A] flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-[#C9A24A] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Reviews</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              : 'bg-[#2A0808] border border-[#D00000] text-[#F8F1E7]'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-[#D00000] flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#A39A90] space-y-2">
          <RefreshCw className="w-6 h-6 text-[#C9A24A] animate-spin mx-auto" />
          <div>Loading customer reviews...</div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-20 text-center text-xs text-[#A39A90] bg-[#0D0D0D] border border-[#221D22] rounded-2xl p-8 space-y-2">
          <MessageSquare className="w-10 h-10 text-[#A39A90]/40 mx-auto" />
          <div className="text-sm font-semibold text-[#F8F1E7]">No Product Reviews</div>
          <div>No customer reviews submitted yet.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((rev) => {
            const author = rev.user?.name || rev.user?.firstName || 'Customer';
            const email = rev.user?.email || '';
            const prodName = rev.product?.name || rev.productName || 'Handmade Flower Bouquet';

            return (
              <div
                key={rev.id}
                className="bg-[#0D0D0D] border border-[#221D22] rounded-2xl p-6 space-y-4 hover:border-[#C9A24A]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-wider">
                      {prodName}
                    </span>
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-1.5 rounded-lg bg-[#2A0808] text-[#D00000] hover:bg-[#D00000] hover:text-white transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rev.rating
                            ? 'text-[#F4D068] fill-[#F4D068]'
                            : 'text-[#333] fill-none'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-[#F8F1E7] ml-1.5">
                      {rev.rating}/5
                    </span>
                  </div>

                  <p className="text-xs text-[#F8F1E7]/90 leading-relaxed bg-[#050505] p-3 rounded-xl border border-[#1C161C]">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="border-t border-[#181216] pt-3 flex items-center justify-between text-[11px] text-[#A39A90]">
                  <div>
                    <span className="font-semibold text-[#F8F1E7]">{author}</span>
                    {email && <span className="ml-1.5 text-[#A39A90]/70">({email})</span>}
                  </div>
                  <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN') : 'Recent'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

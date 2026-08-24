'use client';

import React from 'react';

export default function AnnouncementBar() {
  const announcements = [
    '✨ Online payment only via Razorpay',
    '🌸 Handcrafted to Order — Please place bouquet orders at least 1 week in advance',
    '🎁 Free personalized gift card & luxury gift wrapping included',
    '📦 Express Pan-India Courier Delivery',
  ];

  return (
    <div className="w-full bg-[#050505] border-b border-white/10 text-[#F8F1E7] text-[11px] sm:text-xs py-2 overflow-hidden relative shadow-sm z-40 select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {[1, 2, 3].map((cycle) => (
          <div key={cycle} className="flex items-center gap-6 sm:gap-10 shrink-0 px-4">
            {announcements.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className="text-[#C9A24A] font-semibold flex items-center gap-1.5">
                  {item}
                </span>
                <span className="text-[#C9A24A]/40 font-bold mx-1">•</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

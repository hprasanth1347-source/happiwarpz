import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Sparkles, Gift, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#D00000] shadow-xl shadow-red-950/60 bg-[#050505] p-0.5 mx-auto">
            <Image src="/images/logo.png" alt="Happiwrapz Logo" fill className="object-contain p-0.5" priority />
          </div>
        </div>
        <div>
          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest block">
            The Happiwrapz Story
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#F8F1E7]">
          Made With Love
        </h1>
        <p className="text-base text-[#C9A24A] italic font-serif">
          "Because moments deserve flowers."
        </p>
      </div>

      <div className="bg-[#0D0D0D] border border-[#221D22] rounded-3xl p-8 sm:p-12 space-y-6 text-sm text-[#A39A90] leading-relaxed">
        <p className="text-base text-[#F8F1E7] font-medium">
          Happiwrapz creates handmade floral gifts and thoughtful little surprises designed to make special moments even more memorable.
        </p>

        <p>
          Whether it is a birthday celebration, anniversary, graduation, or a simple gesture of gratitude, our handmade velvet roses, sunshine sunflowers, and charming keychains are crafted to bring smiles that last forever.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#221D22]">
          <div className="space-y-2 bg-[#050505] p-5 rounded-2xl border border-[#221D22]">
            <div className="flex items-center gap-2 text-[#F4D068] font-bold text-sm">
              <Heart className="w-4 h-4 text-[#D00000] fill-current" />
              <span>Handmade Craftsmanship</span>
            </div>
            <p className="text-xs text-[#A39A90]">
              Every single flower petal, ribbon wrap, and keychain charm is meticulously shaped by hand.
            </p>
          </div>

          <div className="space-y-2 bg-[#050505] p-5 rounded-2xl border border-[#221D22]">
            <div className="flex items-center gap-2 text-[#F4D068] font-bold text-sm">
              <Sparkles className="w-4 h-4 text-[#C9A24A]" />
              <span>Fully Customizable</span>
            </div>
            <p className="text-xs text-[#A39A90]">
              Colour changes, custom flower arrangements, and gift card notes are tailored to your preferences.
            </p>
          </div>

          <div className="space-y-2 bg-[#050505] p-5 rounded-2xl border border-[#221D22]">
            <div className="flex items-center gap-2 text-[#F4D068] font-bold text-sm">
              <Gift className="w-4 h-4 text-[#C9A24A]" />
              <span>Gift-Ready Packaging</span>
            </div>
            <p className="text-xs text-[#A39A90]">
              Delivered in boutique presentation wrapping that is ready to present to your loved ones.
            </p>
          </div>

          <div className="space-y-2 bg-[#050505] p-5 rounded-2xl border border-[#221D22]">
            <div className="flex items-center gap-2 text-[#F4D068] font-bold text-sm">
              <Sparkles className="w-4 h-4 text-[#D00000]" />
              <span>Everlasting Memories</span>
            </div>
            <p className="text-xs text-[#A39A90]">
              Unlike natural flowers that wither in days, handmade flowers remain vibrant forever.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-xs uppercase tracking-wider shadow-xl"
        >
          <span>Explore Happiwrapz Collections</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

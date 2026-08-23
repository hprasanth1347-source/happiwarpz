import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Heart, ShieldCheck, Clock, Gift, Star, Zap, Award, Phone } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { fetchFastAPI } from '@/lib/fastapiClient';

export const revalidate = 0;

async function getHomePageData() {
  try {
    const categories = (await fetchFastAPI('/api/categories')) || [];
    const products   = (await fetchFastAPI('/api/products'))   || [];
    const roseProduct      = products.find((p: any) => p.slug?.includes('rose'));
    const sunflowerProduct = products.find((p: any) => p.slug?.includes('sunflower'));
    return { categories, products, roseProduct, sunflowerProduct };
  } catch {
    return { categories: [], products: [], roseProduct: null, sunflowerProduct: null };
  }
}

const TRUST_ITEMS = [
  '🌸 100% Handmade Flowers',
  '✨ Velvet & Satin Quality',
  '🎀 Luxury Gift Packaging',
  '⚡ Same-Day Dispatch',
  '🔒 Razorpay Secured',
  '💛 Personalised Gift Notes',
  '🌹 Custom Colour Options',
  '🎁 Perfect for Every Occasion',
];

export default async function HomePage() {
  const { products } = await getHomePageData();

  const featuredList    = products.filter((p: any) => p.isFeatured);
  const remaining       = products.filter((p: any) => !p.isFeatured);
  const displayProducts = [...featuredList, ...remaining].slice(0, 4);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════
          1. HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[100svh] sm:min-h-[92vh] flex items-center py-12 sm:py-16 lg:py-24"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 30% 40%, #1A0812 0%, #050505 60%, #050505 100%)' }}
      >
        {/* Animated glow orbs */}
        <div className="hero-glow-orb w-[500px] h-[500px] top-[-100px] left-[-100px]"
          style={{ background: 'rgba(139,0,0,0.18)', animationDelay: '0s' }} />
        <div className="hero-glow-orb w-[400px] h-[400px] top-[20%] right-[-80px]"
          style={{ background: 'rgba(201,162,74,0.12)', animationDelay: '2s' }} />
        <div className="hero-glow-orb w-[300px] h-[300px] bottom-[5%] left-[30%]"
          style={{ background: 'rgba(208,0,0,0.10)', animationDelay: '4s' }} />

        {/* Floating sparkle dots */}
        {[...Array(8)].map((_, i) => (
          <div key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#C9A24A] animate-twinkle pointer-events-none"
            style={{
              left:  `${10 + i * 11}%`,
              top:   `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.4}s`,
              opacity: 0.4,
            }}
          />
        ))}

        <div className="site-container relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 xl:gap-20 items-center">

            {/* ── Left Content ── */}
            <div className="space-y-7">

              {/* Headline */}
              <div className="space-y-2 animate-fade-up-d1">
                <h1 className="text-5xl sm:text-6xl lg:text-[68px] xl:text-[76px] font-serif font-bold text-[#F8F1E7] leading-[1.05] tracking-tight">
                  Because Moments<br />
                  <span className="shimmer-text">Deserve Flowers.</span>
                </h1>
              </div>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-[#A39A90] max-w-xl leading-relaxed animate-fade-up-d2">
                Handmade bouquets and thoughtful gifts crafted to make every moment unforgettable.
                Handcrafted with love, made to adore, and designed to last forever.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-fade-up-d3">
                <Link
                  href="/shop?category=rose-bouquets"
                  className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-sm shadow-lg shadow-red-950/40 hover:shadow-red-900/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
                >
                  <span className="relative z-10">Shop Bouquets</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF1111] to-[#AA0000] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link
                  href="/custom-gifts"
                  className="group px-8 py-4 rounded-xl border border-[#C9A24A]/40 bg-[#0D0D0D] text-[#F4D068] font-bold text-sm hover:border-[#C9A24A] hover:bg-[#141414] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4 group-hover:animate-float" />
                  Custom Gift Request
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-[#221D22] animate-fade-up-d4">
                {[
                  { value: '500+', label: 'Happy Customers', color: '#C9A24A' },
                  { value: '100%', label: 'Handmade Quality', color: '#D00000' },
                  { value: '5★',   label: 'Customer Rating',  color: '#F4D068' },
                ].map((stat) => (
                  <div key={stat.value} className="text-left">
                    <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-[11px] text-[#A39A90] mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Hero Image ── */}
            <div className="relative w-full max-w-lg mx-auto lg:ml-auto animate-slide-right">
              {/* Rotating ring decoration */}
              <div className="absolute inset-[-16px] rounded-full border border-[#C9A24A]/20 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-[-32px] rounded-full border border-[#D00000]/10 animate-spin-slow pointer-events-none"
                style={{ animationDirection: 'reverse', animationDuration: '18s' }} />

              {/* Glow behind image */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#8B0000]/40 to-[#C9A24A]/25 blur-2xl transform rotate-3 scale-95 animate-pulse-glow" />

              {/* Main image — clean, no overlays */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#C9A24A]/40 shadow-2xl bg-[#0D0D0D] animate-float-slow animate-pulse-glow aspect-square">
                <Image
                  src="/images/original/happiwrapz_original_1.jpg"
                  alt="Happiwrapz Handmade Roses"
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. MARQUEE TRUST BAR
      ══════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-[#8B0000] via-[#D00000] to-[#8B0000] py-3 overflow-hidden border-y border-[#D00000]/40">
        <div className="flex items-center gap-0">
          <div className="flex items-center gap-10 animate-marquee whitespace-nowrap shrink-0">
            {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
              <span key={i} className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                {item}
                <span className="text-white/40 mx-2">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          3. NEW ARRIVALS PRODUCTS
      ══════════════════════════════════════════ */}
      <section className="py-20 site-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 animate-fade-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181216] border border-[#C9A24A]/40 text-[#F4D068] text-[11px] font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-twinkle text-[#C9A24A]" />
              New Product Feature
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F8F1E7]">
              New Arrivals &amp; <span className="text-[#C9A24A]">Featured Flowers</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-xs text-[#C9A24A] hover:text-[#F4D068] font-bold tracking-wider uppercase border-b border-[#C9A24A]/40 pb-1 hover:border-[#F4D068] transition-colors"
          >
            View Full Shop Catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product: any, i: number) => (
            <div
              key={product.id}
              className="card-hover-lift"
              style={{ animation: `fadeUp 0.6s ${i * 0.12}s ease both` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
          {displayProducts.length === 0 && (
            <div className="col-span-4 text-center py-16 text-[#A39A90]">
              No featured products yet. Add some from the admin panel.
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. WHY HAPPIWRAPZ — FEATURE CARDS
      ══════════════════════════════════════════ */}
      <section className="bg-[#0A0A0A] border-y border-[#221D22] py-20">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-14 animate-fade-up">
            <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">The Boutique Guarantee</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#F8F1E7] mt-2">
              Why Choose <span className="text-[#D00000]">Happiwrapz</span>
            </h2>
            <p className="text-sm text-[#A39A90] mt-3 leading-relaxed">
              Every single piece is handcrafted with love, care, and fine attention to detail.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: <Heart className="w-7 h-7 text-[#D00000] fill-[#D00000]" />,
                title: '100% Handmade',
                desc: 'Crafted by hand with premium satin & velvet fabrics for a luxurious finish.',
                delay: '0s', border: '#D00000',
              },
              {
                icon: <Sparkles className="w-7 h-7 text-[#F4D068]" />,
                title: 'Customizable',
                desc: 'Colour changes, flower counts, ribbons, glitter finishes & personalised notes.',
                delay: '0.1s', border: '#C9A24A',
              },
              {
                icon: <Gift className="w-7 h-7 text-[#C9A24A]" />,
                title: 'Gift Ready',
                desc: 'Wrapped in elegant luxury boutique packaging — ready to present as a gift.',
                delay: '0.2s', border: '#C9A24A',
              },
              {
                icon: <ShieldCheck className="w-7 h-7 text-[#4CAF50]" />,
                title: 'Secure Checkout',
                desc: '100% online payment protection via Razorpay — UPI, Cards, Net Banking.',
                delay: '0.3s', border: '#4CAF50',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group relative p-7 bg-[#0D0D0D] border border-[#221D22] rounded-2xl space-y-4 overflow-hidden card-hover-lift"
                style={{ animation: `fadeUp 0.65s ${f.delay} ease both` }}
              >
                {/* Hover corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${f.border}22 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }} />

                <div className="w-14 h-14 rounded-2xl bg-[#151215] border border-[#221D22] group-hover:border-[#C9A24A]/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  {f.icon}
                </div>
                <h3 className="text-base font-serif font-bold text-[#F8F1E7] group-hover:text-[#C9A24A] transition-colors">{f.title}</h3>
                <p className="text-xs text-[#A39A90] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. CUSTOM GIFT CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="site-container py-20">
        <div
          className="relative overflow-hidden rounded-3xl p-10 lg:p-16 text-center space-y-6 border border-[#C9A24A]/30 animate-fade-up"
          style={{ background: 'linear-gradient(135deg, #180A10 0%, #0D0D0D 50%, #180A10 100%)' }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-10 pointer-events-none animate-float-slow"
            style={{ background: 'radial-gradient(circle, #D00000, transparent)', transform: 'translate(-40%, -40%)' }} />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-10 pointer-events-none animate-float"
            style={{ background: 'radial-gradient(circle, #C9A24A, transparent)', transform: 'translate(40%, 40%)', animationDelay: '3s' }} />

          <span className="relative inline-block text-xs font-bold text-[#F4D068] uppercase tracking-widest border border-[#F4D068]/40 px-4 py-1.5 rounded-full">
            ✨ Special Requests
          </span>
          <h2 className="relative text-3xl sm:text-5xl font-serif font-bold text-[#F8F1E7] leading-tight">
            Want Something <span className="text-[#D00000]">Truly Special</span><br className="hidden sm:block" /> In Mind?
          </h2>
          <p className="relative text-sm text-[#A39A90] max-w-2xl mx-auto leading-relaxed">
            Tell us your vision — flower type, colours, message, wrapping — and our artisans will craft it just for you with care and love.
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/custom-gifts"
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#D00000] to-[#8B0000] text-white font-bold text-sm uppercase tracking-wider hover:shadow-xl hover:shadow-red-900/50 hover:-translate-y-1 transition-all duration-300"
            >
              Request Custom Gift
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#C9A24A]/40 bg-transparent text-[#C9A24A] font-bold text-sm hover:border-[#C9A24A] hover:bg-[#C9A24A]/5 transition-all"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. TESTIMONIALS / SOCIAL PROOF
      ══════════════════════════════════════════ */}
      <section className="bg-[#0A0A0A] border-t border-[#221D22] py-20">
        <div className="site-container">
          <div className="text-center mb-12 animate-fade-up">
            <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-widest">Customer Love</span>
            <h2 className="text-3xl font-serif font-bold text-[#F8F1E7] mt-2">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: 'Priya S.', location: 'Chennai', review: 'The rose bouquet was absolutely stunning! My partner was in tears. The quality of satin flowers is beyond amazing.', stars: 5, delay: '0s' },
              { name: 'Karthik R.', location: 'Bangalore', review: 'Ordered a custom sunflower arrangement. They delivered exactly what I imagined. The gold ribbon was a perfect touch!', stars: 5, delay: '0.1s' },
              { name: 'Meena L.', location: 'Coimbatore', review: 'Best gift I\'ve given! The packaging was luxurious and the flowers look so real. Will definitely order again.', stars: 5, delay: '0.2s' },
            ].map((t) => (
              <div
                key={t.name}
                className="group p-6 bg-[#0D0D0D] border border-[#221D22] rounded-2xl space-y-4 hover:border-[#C9A24A]/40 transition-all duration-300 hover:-translate-y-1"
                style={{ animation: `fadeUp 0.65s ${t.delay} ease both` }}
              >
                <div className="flex gap-1">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#F4D068] fill-[#F4D068]" />
                  ))}
                </div>
                <p className="text-sm text-[#A39A90] leading-relaxed italic">"{t.review}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[#221D22]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D00000] to-[#8B0000] flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#F8F1E7]">{t.name}</div>
                    <div className="text-[10px] text-[#A39A90]">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. SOCIAL / DM CTA
      ══════════════════════════════════════════ */}
      <section className="site-container py-16 text-center animate-fade-up">
        <div className="inline-flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D00000] to-[#8B0000] flex items-center justify-center shadow-lg shadow-red-900/40 animate-pulse-glow-red">
            <Phone className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#F8F1E7]">DM For Any Enquiries 😊</h3>
          <p className="text-sm text-[#A39A90] max-w-md">
            Follow Happiwrapz on social media to see our latest handmade flower creations &amp; customer stories.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C9A24A] bg-[#0D0D0D] border border-[#221D22] px-5 py-2.5 rounded-full hover:border-[#C9A24A]/60 transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              @happiwrapz
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-[#D00000] to-[#8B0000] px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Shop Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

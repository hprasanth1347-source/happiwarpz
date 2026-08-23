"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Paintbrush, 
  Sparkles, 
  ShoppingBag, 
  Check, 
  RotateCcw, 
  Tag, 
  Sliders, 
  Heart, 
  ChevronRight,
  ShieldCheck,
  Gift
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export type KeychainPattern = 
  | "triple-hearts"
  | "cherry-bow"
  | "single-heart"
  | "daisy-flower"
  | "tulip-flower"
  | "ribbon-bow"
  | "sunflower"
  | "tulip-trio"
  | "sakura-blossom"
  | "strawberry"
  | "jellyfish"
  | "cat-paw";

export type HardwareType = "silver-ring" | "gold-ring" | "ball-chain" | "snap-hook" | "beaded-loop";

export default function KeychainBuilderPage() {
  const { addToCart, openDrawer } = useCart();

  // Customization state
  const [pattern, setPattern] = useState<KeychainPattern>("triple-hearts");
  const [primaryColor, setPrimaryColor] = useState<string>("#ec4899"); // Magenta/Pink
  const [secondaryColor, setSecondaryColor] = useState<string>("#f472b6"); // Light Pink
  const [accentColor, setAccentColor] = useState<string>("#ffffff"); // White
  const [hardware, setHardware] = useState<HardwareType>("silver-ring");
  const [hasPearl, setHasPearl] = useState<boolean>(true);
  const [hasVelvetBow, setHasVelvetBow] = useState<boolean>(true);
  const [customInitials, setCustomInitials] = useState<string>("");
  const [specialNote, setSpecialNote] = useState<string>("");

  // Color options
  const colorSwatches = [
    { label: "Magenta Pink", hex: "#ec4899" },
    { label: "Soft Pink", hex: "#f472b6" },
    { label: "Ruby Red", hex: "#dc2626" },
    { label: "Pure White", hex: "#ffffff" },
    { label: "Sky Blue", hex: "#38bdf8" },
    { label: "Olive Green", hex: "#65a30d" },
    { label: "Golden Yellow", hex: "#eab308" },
    { label: "Lilac Purple", hex: "#c084fc" },
    { label: "Midnight Black", hex: "#18181b" },
  ];

  const getPatternBasePrice = (p: KeychainPattern) => {
    if (p === "cat-paw" || p === "jellyfish") return 179;
    if (p === "strawberry" || p === "cherry-bow") return 169;
    return 149;
  };

  let basePrice = getPatternBasePrice(pattern);

  let hardwarePrice = 0;
  if (hardware === "gold-ring" || hardware === "snap-hook") hardwarePrice = 20;
  if (hardware === "beaded-loop") hardwarePrice = 30;

  const addonPrice = (hasPearl ? 15 : 0) + (hasVelvetBow ? 15 : 0);
  const totalPrice = basePrice + hardwarePrice + addonPrice;

  const patternLabels: Record<KeychainPattern, string> = {
    "triple-hearts": "Triple Tiered Hearts",
    "cherry-bow": "Double Cherries with Bow",
    "single-heart": "Single Plush Heart",
    "daisy-flower": "Daisy Flower Bloom",
    "tulip-flower": "Pink/Custom Tulip Bulb",
    "ribbon-bow": "Coiled Ribbon Bow",
    "sunflower": "Radiant Sunflower",
    "tulip-trio": "Tulip Trio Bouquet",
    "sakura-blossom": "Sakura Cherry Blossom",
    "strawberry": "Cute Strawberry Charm",
    "jellyfish": "Pastel Jellyfish Wristlet",
    "cat-paw": "Black & Pink Cat Paw",
  };

  const hardwareLabels: Record<HardwareType, string> = {
    "silver-ring": "Classic Silver Keyring",
    "gold-ring": "Luxury Gold Keyring (+₹20)",
    "ball-chain": "Silver Ball Chain",
    "snap-hook": "Swivel Snap Lobster Hook (+₹20)",
    "beaded-loop": "Pearl Beaded Wristlet Loop (+₹30)",
  };

  const handleAddToCart = async () => {
    const customTitle = `Custom ${patternLabels[pattern]} Keychain`;
    const details = `Pattern: ${patternLabels[pattern]}, Colors: [Primary: ${primaryColor}, Secondary: ${secondaryColor}], Hardware: ${hardwareLabels[hardware]}${hasPearl ? ", Pearl Core" : ""}${hasVelvetBow ? ", Velvet Bow" : ""}${customInitials ? `, Initials: ${customInitials}` : ""}`;

    await addToCart(
      "custom-keychain-id",
      1,
      hardwareLabels[hardware],
      details,
      specialNote || undefined
    );

    openDrawer();
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 pb-20">
      
      {/* Header */}
      <section className="bg-gradient-to-b from-brand-950/60 via-dark-surface to-black border-b border-dark-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider">
            <Paintbrush className="w-3.5 h-3.5" /> Interactive 2D Keychain Visualizer
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Design Your Custom Pipe Cleaner Keychain
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            Choose your pattern, pick chenille stem colors, customize pearl & ribbon accents, and get your personalized handcrafted keychain delivered!
          </p>
        </div>
      </section>

      {/* Visualizer & Studio Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Live Canvas/SVG Preview Box */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="sticky top-20 bg-dark-surface border border-dark-border rounded-3xl p-6 flex flex-col items-center justify-between min-h-[460px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Live Interactive Preview
            </div>

            {/* Hardware Keyring Graphic at Top */}
            <div className="w-full flex justify-center pt-8">
              <svg width="60" height="70" viewBox="0 0 60 70" fill="none">
                {hardware === "gold-ring" ? (
                  <>
                    <circle cx="30" cy="22" r="18" stroke="#eab308" strokeWidth="4" />
                    <circle cx="30" cy="44" r="5" stroke="#eab308" strokeWidth="2.5" />
                    <circle cx="30" cy="56" r="4" stroke="#eab308" strokeWidth="2" />
                  </>
                ) : hardware === "beaded-loop" ? (
                  <>
                    <ellipse cx="30" cy="25" rx="20" ry="18" stroke="#ffffff" strokeWidth="4" strokeDasharray="3 3" />
                    <circle cx="30" cy="50" r="4" fill="#ffffff" />
                  </>
                ) : (
                  <>
                    <circle cx="30" cy="22" r="18" stroke="#9ca3af" strokeWidth="4" />
                    <circle cx="30" cy="44" r="5" stroke="#9ca3af" strokeWidth="2.5" />
                    <circle cx="30" cy="56" r="4" stroke="#9ca3af" strokeWidth="2" />
                  </>
                )}
              </svg>
            </div>

            {/* Dynamic SVG Pipe Cleaner Preview Model */}
            <div className="w-full h-64 flex items-center justify-center my-4 relative">
              
              {/* TRIPLE HEARTS */}
              {pattern === "triple-hearts" && (
                <svg width="160" height="220" viewBox="0 0 160 220" className="drop-shadow-2xl">
                  {/* Top Heart */}
                  <path d="M80 50 C60 20, 20 40, 55 80 L80 100 L105 80 C140 40, 100 20, 80 50 Z" 
                    fill={primaryColor} stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" />
                  {/* Middle Heart */}
                  <path d="M80 90 C60 60, 25 80, 58 115 L80 135 L102 115 C135 80, 100 60, 80 90 Z" 
                    fill={secondaryColor} stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" />
                  {/* Bottom Heart */}
                  <path d="M80 130 C60 100, 30 120, 60 150 L80 170 L100 150 C130 120, 100 100, 80 130 Z" 
                    fill={accentColor} stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" />
                </svg>
              )}

              {/* CHERRY BOW & PEARL */}
              {pattern === "cherry-bow" && (
                <svg width="180" height="220" viewBox="0 0 180 220" className="drop-shadow-2xl">
                  {/* Stem loops */}
                  <path d="M90 60 C50 20, 20 80, 75 90 Z" fill="none" stroke={secondaryColor} strokeWidth="8" strokeLinecap="round" />
                  <path d="M90 60 C130 20, 160 80, 105 90 Z" fill="none" stroke={secondaryColor} strokeWidth="8" strokeLinecap="round" />
                  {/* Bow Pearl */}
                  {hasPearl && <circle cx="90" cy="75" r="9" fill="#fff" stroke="#e2e8f0" strokeWidth="2" />}
                  {/* Left Cherry */}
                  <circle cx="55" cy="145" r="32" fill={primaryColor} stroke="#ffffff" strokeWidth="3" />
                  <circle cx="48" cy="135" r="8" fill="#ffffff" opacity="0.4" />
                  {/* Right Cherry */}
                  <circle cx="125" cy="145" r="32" fill={primaryColor} stroke="#ffffff" strokeWidth="3" />
                  <circle cx="118" cy="135" r="8" fill="#ffffff" opacity="0.4" />
                </svg>
              )}

              {/* SINGLE PLUSH HEART */}
              {pattern === "single-heart" && (
                <svg width="180" height="180" viewBox="0 0 180 180" className="drop-shadow-2xl">
                  <path d="M90 40 C60 0, 10 30, 60 95 L90 135 L120 95 C170 30, 120 0, 90 40 Z" 
                    fill={primaryColor} stroke="#ffffff" strokeWidth="5" strokeLinejoin="round" />
                  {hasPearl && <circle cx="90" cy="75" r="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />}
                </svg>
              )}

              {/* DAISY FLOWER */}
              {pattern === "daisy-flower" && (
                <svg width="200" height="220" viewBox="0 0 200 220" className="drop-shadow-2xl">
                  {/* Stem */}
                  <path d="M100 120 L100 190" stroke={accentColor} strokeWidth="10" strokeLinecap="round" />
                  <path d="M100 160 C70 140, 60 160, 100 160 Z" fill={accentColor} />
                  {/* 6 Petals */}
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <g key={i} transform={`rotate(${deg} 100 80)`}>
                      <ellipse cx="100" cy="40" rx="16" ry="32" fill={primaryColor} stroke="#ffffff" strokeWidth="2" />
                    </g>
                  ))}
                  {/* Pompom core */}
                  <circle cx="100" cy="80" r="22" fill={secondaryColor} stroke="#ffffff" strokeWidth="3" />
                </svg>
              )}

              {/* TULIP FLOWER */}
              {pattern === "tulip-flower" && (
                <svg width="180" height="220" viewBox="0 0 180 220" className="drop-shadow-2xl">
                  {/* Stem */}
                  <path d="M90 110 L90 190" stroke={accentColor} strokeWidth="10" strokeLinecap="round" />
                  <path d="M90 160 C130 140, 140 180, 90 180 Z" fill={accentColor} />
                  {/* Tulip Petals */}
                  <path d="M50 70 C50 120, 130 120, 130 70 C130 30, 100 40, 90 70 C80 40, 50 30, 50 70 Z" 
                    fill={primaryColor} stroke="#ffffff" strokeWidth="4" />
                </svg>
              )}

              {/* RIBBON BOW */}
              {pattern === "ribbon-bow" && (
                <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-2xl">
                  <path d="M100 90 C40 30, 10 110, 85 105 Z" fill={primaryColor} stroke="#ffffff" strokeWidth="4" />
                  <path d="M100 90 C160 30, 190 110, 115 105 Z" fill={primaryColor} stroke="#ffffff" strokeWidth="4" />
                  <path d="M100 90 C60 160, 40 170, 70 180 Z" fill={secondaryColor} />
                  <path d="M100 90 C140 160, 160 170, 130 180 Z" fill={secondaryColor} />
                  {hasPearl && <circle cx="100" cy="95" r="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />}
                </svg>
              )}

              {/* SUNFLOWER */}
              {pattern === "sunflower" && (
                <svg width="200" height="220" viewBox="0 0 200 220" className="drop-shadow-2xl">
                  {/* Stem */}
                  <path d="M100 120 L100 190" stroke={accentColor} strokeWidth="10" strokeLinecap="round" />
                  {/* Petals */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                    <g key={i} transform={`rotate(${deg} 100 90)`}>
                      <ellipse cx="100" cy="45" rx="12" ry="30" fill={primaryColor} stroke="#ffffff" strokeWidth="1.5" />
                    </g>
                  ))}
                  {/* Coiled center */}
                  <circle cx="100" cy="90" r="26" fill={secondaryColor} stroke="#ffffff" strokeWidth="3" />
                </svg>
              )}

              {/* TULIP TRIO */}
              {pattern === "tulip-trio" && (
                <svg width="200" height="220" viewBox="0 0 200 220" className="drop-shadow-2xl">
                  {/* Stems */}
                  <path d="M70 90 L100 180" stroke={accentColor} strokeWidth="6" />
                  <path d="M100 80 L100 180" stroke={accentColor} strokeWidth="6" />
                  <path d="M130 90 L100 180" stroke={accentColor} strokeWidth="6" />
                  {/* Tulips */}
                  <circle cx="70" cy="70" r="22" fill={primaryColor} stroke="#ffffff" strokeWidth="3" />
                  <circle cx="100" cy="55" r="24" fill={primaryColor} stroke="#ffffff" strokeWidth="3" />
                  <circle cx="130" cy="70" r="22" fill={primaryColor} stroke="#ffffff" strokeWidth="3" />
                  {/* Bow */}
                  <path d="M100 130 C70 110, 60 140, 100 140 C140 140, 130 110, 100 130 Z" fill={secondaryColor} />
                  {hasPearl && <circle cx="100" cy="135" r="7" fill="#ffffff" />}
                </svg>
              )}

              {/* SAKURA BLOSSOM */}
              {pattern === "sakura-blossom" && (
                <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-2xl">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <g key={i} transform={`rotate(${deg} 100 100)`}>
                      <path d="M100 100 C80 40, 120 40, 100 100 Z" fill={primaryColor} stroke="#ffffff" strokeWidth="2" />
                    </g>
                  ))}
                  <circle cx="100" cy="100" r="24" fill={secondaryColor} />
                  {hasPearl && <circle cx="100" cy="100" r="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />}
                </svg>
              )}

              {/* STRAWBERRY */}
              {pattern === "strawberry" && (
                <svg width="180" height="200" viewBox="0 0 180 200" className="drop-shadow-2xl">
                  <path d="M90 60 C40 60, 30 140, 90 180 C150 140, 140 60, 90 60 Z" fill={primaryColor} stroke="#ffffff" strokeWidth="4" />
                  <path d="M90 60 C60 40, 120 40, 90 60 Z" fill={accentColor} stroke="#ffffff" strokeWidth="3" />
                  {/* Seed pearls */}
                  <circle cx="70" cy="100" r="3" fill="#ffffff" />
                  <circle cx="110" cy="100" r="3" fill="#ffffff" />
                  <circle cx="90" cy="130" r="3" fill="#ffffff" />
                </svg>
              )}

              {/* JELLYFISH */}
              {pattern === "jellyfish" && (
                <svg width="180" height="220" viewBox="0 0 180 220" className="drop-shadow-2xl">
                  {/* Dome */}
                  <path d="M40 90 C40 30, 140 30, 140 90 C140 100, 40 100, 40 90 Z" fill={primaryColor} stroke="#ffffff" strokeWidth="3" />
                  {/* Tentacles */}
                  <path d="M60 95 Q50 130, 60 160 Q70 190, 60 210" stroke={secondaryColor} strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="M90 95 Q100 130, 90 160 Q80 190, 90 210" stroke={secondaryColor} strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="M120 95 Q110 130, 120 160 Q130 190, 120 210" stroke={secondaryColor} strokeWidth="5" fill="none" strokeLinecap="round" />
                  {hasPearl && <circle cx="90" cy="55" r="6" fill="#ffffff" />}
                </svg>
              )}

              {/* CAT PAW */}
              {pattern === "cat-paw" && (
                <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-2xl">
                  {/* Main Paw Base */}
                  <ellipse cx="100" cy="125" rx="45" ry="35" fill={primaryColor} stroke="#ffffff" strokeWidth="4" />
                  <ellipse cx="100" cy="125" rx="30" ry="22" fill={secondaryColor} />
                  {/* Toe Beans */}
                  <circle cx="60" cy="75" r="16" fill={primaryColor} stroke="#ffffff" strokeWidth="3" />
                  <circle cx="60" cy="75" r="10" fill={secondaryColor} />

                  <circle cx="88" cy="60" r="16" fill={primaryColor} stroke="#ffffff" strokeWidth="3" />
                  <circle cx="88" cy="60" r="10" fill={secondaryColor} />

                  <circle cx="118" cy="60" r="16" fill={primaryColor} stroke="#ffffff" strokeWidth="3" />
                  <circle cx="118" cy="60" r="10" fill={secondaryColor} />

                  <circle cx="145" cy="75" r="16" fill={primaryColor} stroke="#ffffff" strokeWidth="3" />
                  <circle cx="145" cy="75" r="10" fill={secondaryColor} />
                </svg>
              )}

            </div>

            {/* Custom initials badge tag if entered */}
            {customInitials.trim() && (
              <div className="bg-brand-500/20 border border-brand-400/40 text-brand-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 mb-2">
                <Tag className="w-3.5 h-3.5" /> Initial Tag: &quot;{customInitials.toUpperCase()}&quot;
              </div>
            )}

            {/* Summary & Price */}
            <div className="w-full border-t border-dark-border pt-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Estimated Price</p>
                <p className="text-2xl font-bold text-white">₹{totalPrice}</p>
              </div>

              <button
                onClick={handleAddToCart}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg shadow-brand-600/30 transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" /> Add Custom Keychain
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Customizer Controls */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* STEP 1: Pattern Selector */}
          <div className="bg-dark-surface border border-dark-border p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-dark-border pb-3">
              <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 font-bold text-xs flex items-center justify-center">1</span>
              <h3 className="font-bold text-white text-base">Select Keychain Base Pattern</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(patternLabels) as KeychainPattern[]).map((pat) => (
                <button
                  key={pat}
                  onClick={() => setPattern(pat)}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                    pattern === pat
                      ? "bg-brand-600/20 border-brand-500 text-white shadow-md"
                      : "bg-dark-card border-dark-border text-gray-400 hover:border-gray-700 hover:text-gray-200"
                  }`}
                >
                  <div className="font-bold text-white line-clamp-1">{patternLabels[pat]}</div>
                  <div className="text-[10px] text-brand-300 mt-1">₹{getPatternBasePrice(pat)} base</div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: Color Customization */}
          <div className="bg-dark-surface border border-dark-border p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-2 border-b border-dark-border pb-3">
              <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 font-bold text-xs flex items-center justify-center">2</span>
              <h3 className="font-bold text-white text-base">Pick Chenille Stem Colors</h3>
            </div>

            {/* Primary Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">Primary Color (Main Charm Body)</label>
              <div className="flex flex-wrap gap-2">
                {colorSwatches.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setPrimaryColor(c.hex)}
                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      primaryColor === c.hex ? "border-brand-500 scale-110 shadow-lg" : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  >
                    {primaryColor === c.hex && <Check className={`w-4 h-4 ${c.hex === "#ffffff" ? "text-black" : "text-white"}`} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">Secondary Color (Accents / Petals / Core)</label>
              <div className="flex flex-wrap gap-2">
                {colorSwatches.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSecondaryColor(c.hex)}
                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      secondaryColor === c.hex ? "border-brand-500 scale-110 shadow-lg" : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  >
                    {secondaryColor === c.hex && <Check className={`w-4 h-4 ${c.hex === "#ffffff" ? "text-black" : "text-white"}`} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">Stem / Leaf Color</label>
              <div className="flex flex-wrap gap-2">
                {colorSwatches.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setAccentColor(c.hex)}
                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      accentColor === c.hex ? "border-brand-500 scale-110 shadow-lg" : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  >
                    {accentColor === c.hex && <Check className={`w-4 h-4 ${c.hex === "#ffffff" ? "text-black" : "text-white"}`} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 3: Keyring Hardware & Attachments */}
          <div className="bg-dark-surface border border-dark-border p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-dark-border pb-3">
              <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 font-bold text-xs flex items-center justify-center">3</span>
              <h3 className="font-bold text-white text-base">Select Hardware Keyring Attachment</h3>
            </div>

            <div className="space-y-2">
              {(Object.keys(hardwareLabels) as HardwareType[]).map((hw) => (
                <label
                  key={hw}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    hardware === hw
                      ? "bg-brand-600/20 border-brand-500 text-white font-semibold"
                      : "bg-dark-card border-dark-border text-gray-400 hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="hardware"
                      checked={hardware === hw}
                      onChange={() => setHardware(hw)}
                      className="accent-brand-500"
                    />
                    <span>{hardwareLabels[hw]}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* STEP 4: Extras & Personalization */}
          <div className="bg-dark-surface border border-dark-border p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-dark-border pb-3">
              <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 font-bold text-xs flex items-center justify-center">4</span>
              <h3 className="font-bold text-white text-base">Extras & Personalization Tag</h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-dark-card border border-dark-border rounded-xl text-xs text-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPearl}
                  onChange={(e) => setHasPearl(e.target.checked)}
                  className="accent-brand-500 rounded"
                />
                <span>Add Synthetic Pearl Core Bead (+₹15)</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-dark-card border border-dark-border rounded-xl text-xs text-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVelvetBow}
                  onChange={(e) => setHasVelvetBow(e.target.checked)}
                  className="accent-brand-500 rounded"
                />
                <span>Add Satin/Velvet Ribbon Bow Knot</span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Custom Initial Charm Tag (+₹25)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={customInitials}
                  onChange={(e) => setCustomInitials(e.target.value)}
                  placeholder="e.g. A, PS, H"
                  className="w-full bg-black border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 uppercase tracking-widest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Special Craft Notes / Gift Card Request
                </label>
                <textarea
                  rows={2}
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="e.g. Please wrap in a pink gift box with a happy birthday card..."
                  className="w-full bg-black border border-dark-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-gradient-to-r from-brand-950 via-dark-surface to-dark-surface border border-brand-500/40 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-gray-400">Total Price</div>
              <div className="text-3xl font-bold text-white">₹{totalPrice}</div>
              <div className="text-[11px] text-brand-300 font-semibold mt-0.5">✦ Includes custom hand-weaving</div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-xl shadow-brand-600/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" /> Add Customized Keychain to Cart
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

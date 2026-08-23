'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function PageEntry() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'done'>('visible');

  useEffect(() => {
    // Lock scroll while entry is showing
    document.body.style.overflow = 'hidden';

    const fadeTimer = setTimeout(() => setPhase('fading'), 600);
    const doneTimer = setTimeout(() => {
      setPhase('done');
      document.body.style.overflow = '';
    }, 950);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = '';
    };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
        transition: 'opacity 0.35s ease',
        opacity: phase === 'fading' ? 0 : 1,
        pointerEvents: phase === 'fading' ? 'none' : 'all',
      }}
    >
      {/* Subtle radial glow behind logo */}
      <div style={{
        position: 'absolute',
        width: 340,
        height: 340,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,0,0,0.22) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'entryGlow 1.6s ease-out both',
      }} />

      {/* Logo + Wordmark */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        animation: 'entryUp 0.9s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        {/* Logo ring */}
        <div style={{
          position: 'relative',
          width: 76,
          height: 76,
          borderRadius: '50%',
          border: '1.5px solid rgba(201,162,74,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0D0D0D',
          boxShadow: '0 0 32px rgba(139,0,0,0.35)',
        }}>
          <Image
            src="/images/logo.png"
            alt="Happiwrapz"
            width={56}
            height={56}
            className="object-contain"
            priority
          />
        </div>

        {/* Wordmark */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#F8F1E7',
            fontFamily: 'var(--font-playfair, Georgia, serif)',
            lineHeight: 1,
          }}>
            Happi<span style={{ color: '#D00000' }}>wrapz</span>
          </p>
          <p style={{
            marginTop: 8,
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#C9A24A',
            fontFamily: 'var(--font-inter, sans-serif)',
            fontWeight: 500,
            animation: 'entryUp 0.9s 0.2s cubic-bezier(0.16,1,0.3,1) both',
          }}>
            Because moments deserve flowers
          </p>
        </div>
      </div>

      {/* Thin progress line at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 2,
        background: 'linear-gradient(90deg, #8B0000, #D00000, #C9A24A)',
        animation: 'entryLine 1.6s cubic-bezier(0.4,0,0.2,1) both',
      }} />

      <style>{`
        @keyframes entryUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes entryGlow {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes entryLine {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}

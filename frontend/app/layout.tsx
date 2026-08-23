import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['600', '700', '800'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Happiwrapz | Handmade Flowers & Gifts',
  description:
    'Shop handmade bouquets, floral gifts, keychains and customized gifts from Happiwrapz. Because moments deserve flowers.',
  keywords: [
    'Happiwrapz',
    'Handmade Flowers',
    'Rose Bouquets',
    'Sunflower Bouquets',
    'Handmade Keychains',
    'Custom Gifts',
    'Floral Gifts',
    'Glitter Roses',
  ],
  openGraph: {
    title: 'Happiwrapz | Handmade Flowers & Gifts',
    description:
      'Handmade bouquets and thoughtful gifts, created to make every moment special. Because moments deserve flowers.',
    url: 'https://happiwrapz.com',
    siteName: 'Happiwrapz',
    images: [
      {
        url: '/images/original/happiwrapz_original_1.jpg',
        width: 600,
        height: 600,
        alt: 'Happiwrapz Handmade Flowers',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-[#050505] text-[#F8F1E7] antialiased min-h-screen flex flex-col justify-between selection:bg-[#D00000] selection:text-white">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <CartDrawer />
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

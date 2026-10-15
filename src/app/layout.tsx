import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import AnnouncementBar from '@/components/AnnouncementBar';

export const metadata: Metadata = {
  title: 'Saba Cosmetics — Skincare & Beauty, Made Honest',
  description:
    'Saba Cosmetics brings gentle, effective skincare and beauty essentials to every skin type across Pakistan. Shop serums, cleansers, and makeup crafted to be simple and honest.',
  openGraph: {
    title: 'Saba Cosmetics',
    description: 'Branded & imported beauty, all in one place.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#241c18',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'auto' }}>
      <body style={{ overflowAnchor: 'none' }}>
        <CartProvider>
          <AnnouncementBar />
          <Header />
          {children}
          <Footer />
          <CartDrawer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
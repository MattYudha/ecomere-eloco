import type { Metadata } from 'next';
import { Inter, Forum, DM_Sans } from 'next/font/google';
import './globals.css';
import 'svgmap/dist/svgMap.min.css';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/Providers';
import SessionTimeoutWrapper from '@/components/SessionTimeoutWrapper';
import { ThemeProvider } from '@/context/ThemeContext';
import { WishlistModule } from '@/components/modules/wishlist';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';

// Fonts
const inter = Inter({ subsets: ['latin'] });
const forum = Forum({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-forum',
});
const dm_sans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Elloco – Premium Snacks & E-Commerce Platform',
  description: 'Your premium destination for electronics',
  // icons: {
  //   icon: '/assets/logo.png',
  //   apple: '/assets/logo.png',
  // },
};

import { AuthProvider } from '@/context/auth-context';

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${forum.variable} ${dm_sans.variable}`}
      >
        {/* FIX: Jangan pakai getServerSession di RootLayout, penyebab infinite loop */}
        <ThemeProvider>
          <Providers>
            <AuthProvider>
              <SessionTimeoutWrapper />

              <Header />

              <ClientLayoutWrapper>
                <main className="pt-[80px] relative z-10 mb-20 min-h-screen">
                  {children}
                </main>
              </ClientLayoutWrapper>

              <Footer />

              {/* Floating WhatsApp Button */}
              <FloatingWhatsAppButton />
            </AuthProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

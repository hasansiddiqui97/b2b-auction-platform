import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hayaland Wholesale - B2B Auction Platform',
  description: 'International wholesale and auction platform connecting Japanese sellers with global buyers. Buy iPhones, MacBooks, iPads, Sony, Canon at wholesale prices.',
  keywords: ['wholesale', 'auction', 'Japan electronics', 'iPhone', 'MacBook', 'b2b', 'electronics'],
  authors: [{ name: 'Hayaland' }],
  openGraph: {
    title: 'Hayaland Wholesale - B2B Auction Platform',
    description: 'International wholesale and auction platform connecting Japanese sellers with global buyers',
    type: 'website',
    locale: 'en_US',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
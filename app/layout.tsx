import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hoopra Search',
  description: 'Hoopra Search – the precision-first search and discovery companion.'
};

export const viewport: Viewport = {
  themeColor: '#101828',
  colorScheme: 'light'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

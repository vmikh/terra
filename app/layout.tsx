import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TERRA — Earth through time',
  description:
    'Explore 4.54 billion years of Earth’s history and its possible futures. An interactive planetary atlas.',
  metadataBase: new URL(
    process.env.TERRA_STATIC_EXPORT === '1'
      ? 'https://terra-sim.vercel.app'
      : 'https://terra-earth-through-time.vmikh.chatgpt.site',
  ),
  openGraph: {
    title: 'TERRA — Earth through time',
    description:
      'One planet. 52 epochs. Explore our past and possible futures.',
    images: [
      {
        url: '/og.png',
        width: 1536,
        height: 1024,
        alt: 'TERRA — Earth through time',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TERRA — Earth through time',
    description:
      'One planet. 52 epochs. Explore our past and possible futures.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

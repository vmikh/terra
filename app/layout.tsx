import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Terra: Earth through time',
  description:
    'Explore 4.54 billion years of Earth’s history and its possible futures. An interactive planetary atlas.',
  metadataBase: new URL(
    process.env.TERRA_STATIC_EXPORT === '1'
      ? 'https://terra-sim.vercel.app'
      : 'https://terra-earth-through-time.vmikh.chatgpt.site',
  ),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Terra: Earth through time',
    description:
      'One planet. 52 epochs. Explore our past and possible futures.',
    images: [
      {
        url: '/og.png',
        width: 1536,
        height: 1024,
        alt: 'Terra: Earth through time',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terra: Earth through time',
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
    <html lang="ru" data-theme="dark">
      <body>{children}</body>
    </html>
  );
}

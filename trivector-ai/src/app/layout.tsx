import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Trivector.AI — Data Visualization & Machine Learning',
  description:
    'Building interactive data experiences with modern web technologies. Powered by React, Next.js, D3.js, Three.js, and advanced ML capabilities.',
  keywords: [
    'data visualization',
    '3D graphics',
    'machine learning',
    'D3.js',
    'Three.js',
    'React',
    'Next.js',
    'interactive data',
    'web visualization',
  ],
  authors: [{ name: 'Trivector.AI' }],
  creator: 'Trivector.AI',
  publisher: 'Trivector.AI',
  metadataBase: new URL('https://trivector.ai'),
  openGraph: {
    title: 'Trivector.AI',
    description: 'Data Visualization, 3D Graphics & Machine Learning',
    url: 'https://trivector.ai',
    siteName: 'Trivector.AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trivector.AI',
    description: 'Data Visualization, 3D Graphics & Machine Learning',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

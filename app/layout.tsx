import './globals.css';

export const metadata = {
  title: 'Trivector.ai',
  description: 'Quantum-native AI. Minimal. Cosmic. Sovereign.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-gray-100 selection:bg-cyan-500/20 selection:text-cyan-300">
        <div className="fixed inset-0 -z-10 bg-cosmic"></div>
        <div className="noise-overlay"></div>
        {children}
      </body>
    </html>
  );
}

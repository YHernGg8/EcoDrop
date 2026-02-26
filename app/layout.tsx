import type { Metadata } from 'next';
import { AuthProvider } from '@/hooks/useAuth';
import { LanguageProvider } from '@/hooks/useLanguage';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoDrop - Digitalizing Waste',
  description: 'AI Smart Scan for Used Cooking Oil recycling',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

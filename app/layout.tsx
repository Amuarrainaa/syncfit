import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { ReactQueryProvider } from '@/components/react-query-provider';
import { AnalyticsBanner } from '@/components/analytics-banner';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SyncFit',
  description: 'PWA para entreno de fuerza y nutrición integrados',
  metadataBase: new URL('https://syncfit.local'),
  manifest: '/manifest.json'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn(inter.className, 'bg-slate-100 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100')}>
        <ThemeProvider>
          <ReactQueryProvider>
            <AnalyticsBanner />
            {children}
            <Toaster />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

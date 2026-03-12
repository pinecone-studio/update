import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './_components/ThemeProvider';

export const metadata: Metadata = {
  title: 'EBMS — Employee Benefits Management',
  description: 'Pinequest S3 Ep1 — Employee Benefits Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-[#0F172A] dark:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

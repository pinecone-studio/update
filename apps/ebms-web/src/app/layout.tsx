import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

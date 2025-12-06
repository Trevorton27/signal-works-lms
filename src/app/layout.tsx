import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import '@/styles/globals.css';
import NavBar from '@/modules/common/NavBar';

export const metadata: Metadata = {
  title: 'Signal Works LMS',
  description: 'AI-powered learning management system with adaptive assessment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <NavBar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

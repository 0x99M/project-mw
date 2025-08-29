'use client';

import './globals.css';
import { useState } from 'react';
import { Montserrat } from "next/font/google";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased m-0`}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}

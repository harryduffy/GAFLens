// app/layout.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manager Lens',
  description: 'Manager database and meetings platform for Global Alternative Funds',
  icons: {
    icon: '/favicon.png', // your custom favicon
  },
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

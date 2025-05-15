import { ReactNode } from 'react';

export const metadata = {
  title: 'GAFLens',
  description: 'Manager Selection Dashboard for GAF',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

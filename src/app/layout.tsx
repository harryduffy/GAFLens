// src/app/layout.tsx
import { Metadata } from "next";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "../app/dashboard.css"; // adjust path if necessary

import LoadingWrapper from "../components/LoadingWrapper";
// ConditionalHeader removed

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manager Lens",
  description: "Manager database and meetings platform for Global Alternative Funds",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <LoadingWrapper>
            {children}
          </LoadingWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}
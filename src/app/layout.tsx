// src/app/layout.tsx
import { Metadata } from "next";
import Providers from "../components/Providers";
import LoadingWrapper from "../components/LoadingWrapper";

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
      <body>
        <LoadingWrapper>
          <Providers>{children}</Providers>
        </LoadingWrapper>
      </body>
    </html>
  );
}
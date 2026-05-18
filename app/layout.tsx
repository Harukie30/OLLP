import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { PageLoadingProvider } from "@/components/page-loading-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shrine and Parish of Our Lady of Lourdes",
  description:
    "A welcoming church family worship, community, and faith in Jesus. Plan your visit today.",
  icons: {
    icon: [{ url: "/logo.jpg", type: "image/jpeg" }],
    apple: [{ url: "/logo.jpg", type: "image/jpeg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PageLoadingProvider>{children}</PageLoadingProvider>
      </body>
    </html>
  );
}

import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "QR Studio — Professional QR Code Generator & SaaS Platform",
  description:
    "Generate, customize, and download high-resolution static QR codes for URLs, Wi-Fi networks, text, email, phone numbers, and SMS. 100% client-side privacy, vector SVG and high-res PNG export.",
  keywords: [
    "QR code generator",
    "free QR generator",
    "wifi QR code",
    "vector QR code",
    "SVG QR code",
    "custom QR code",
    "QR code maker",
  ],
  authors: [{ name: "QR Studio Team" }],
  openGraph: {
    title: "QR Studio — Professional QR Code Generator",
    description:
      "Modern, fast, and privacy-respecting QR code generator. Export vector SVG and high-resolution PNG for web, print, and physical signage.",
    url: "https://qrstudio.app",
    siteName: "QR Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Studio — Professional QR Code Generator",
    description:
      "Generate custom QR codes instantly with live preview, branding logos, and vector SVG exports.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={<div className="h-16 border-b border-slate-200/80 dark:border-slate-800/80" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, Sora } from "next/font/google";
import { Toaster } from "sonner";
import { buildRootMetadata } from "@/features/seo/site-metadata";
import "./globals.css";
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"><head>
        <meta name="color-scheme" content="light" />
      </head><body
        className={`${plusJakarta.variable} ${sora.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster richColors closeButton position="top-center" />
      </body></html>
  );
}

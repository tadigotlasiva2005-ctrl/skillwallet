import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HouseHunt — Smart House Rental & Real Estate Platform",
  description:
    "Discover, rent, buy, and manage premium properties with HouseHunt. Advanced search, verified listings, real-time chat, and smart dashboards for users, owners, and admins.",
  keywords: [
    "HouseHunt",
    "real estate",
    "rent property",
    "buy house",
    "property listings",
    "apartments",
    "villas",
    "real estate platform",
  ],
  authors: [{ name: "HouseHunt Team" }],
  openGraph: {
    title: "HouseHunt — Smart House Rental & Real Estate Platform",
    description:
      "Discover, rent, buy, and manage premium properties with advanced search, verified listings, and smart dashboards.",
    siteName: "HouseHunt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HouseHunt — Smart Real Estate Platform",
    description: "Rent, buy, and manage premium properties with HouseHunt.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
          <SonnerToaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

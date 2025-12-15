import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Structify AI - Unstructured Data to Structured Insights",
  description: "Advanced AI-powered tool to convert unstructured documents (PDFs, text, etc.) into structured data like CSVs, Excel, and JSON.",
  keywords: ["Structify AI", "Data Conversion", "NLP", "AI", "Structured Data", "PDF to CSV", "Next.js"],
  authors: [{ name: "Structify AI Team" }],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Structify AI",
    description: "Transform unstructured documents into structured insights with AI.",
    url: "https://structify.ai",
    siteName: "Structify AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Structify AI",
    description: "Transform unstructured documents into structured insights with AI.",
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}

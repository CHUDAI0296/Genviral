import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Script from "next/script";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "AI Video Generator - Create Viral Videos | GenViral",
  description: "Create engaging social media videos instantly with AI. Perfect for TikTok, Instagram, YouTube Shorts. No editing skills needed. Free trial!",
  keywords: "AI video generator, no editing skills, social media videos, viral video creator, TikTok video maker, Instagram videos, YouTube Shorts, AI content creation, video marketing tool, free video generator",
  authors: [{ name: "GenViral Team" }],
  creator: "GenViral",
  publisher: "GenViral",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.genviral.live/"
  },
  openGraph: {
    title: "AI Video Generator - Create Viral Videos | GenViral",
    description: "Create engaging social media videos instantly with AI. Perfect for TikTok, Instagram, YouTube Shorts.",
    type: "website",
    locale: "en_US",
    siteName: "GenViral"
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Generator - Create Viral Videos | GenViral",
    description: "Create engaging social media videos instantly with AI. Perfect for TikTok, Instagram, YouTube Shorts.",
    creator: "@GenViral"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J8S2S6GLMT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J8S2S6GLMT');
          `}
        </Script>
        
        {/* Umami Analytics */}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="a2b916d8-bd35-45dc-9b48-30a19b7c63d1"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

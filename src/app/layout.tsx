import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Video Generator - Create Viral Social Media Videos Without Editing Skills | GenViral",
  description: "No video editing skills required! GenViral's AI-powered video generator creates engaging social media content with a single click. Perfect for TikTok, Instagram, YouTube Shorts. Generate viral videos instantly, boost your social media presence. Free trial available!",
  keywords: "AI video generator, no editing skills required, social media videos, viral video creator, one-click video generation, TikTok video maker, Instagram videos, YouTube Shorts, AI content creation, automatic video editing, social media marketing, video marketing tool, free video generator, smart video creation, short video maker",
  authors: [{ name: "GenViral Team" }],
  creator: "GenViral",
  publisher: "GenViral",
  robots: "index, follow",
  openGraph: {
    title: "AI Video Generator - Create Viral Social Media Videos Without Editing Skills",
    description: "No video editing skills required! GenViral's AI-powered video generator creates engaging social media content with a single click.",
    type: "website",
    locale: "en_US",
    siteName: "GenViral"
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Generator - Create Viral Social Media Videos Without Editing Skills",
    description: "No video editing skills required! GenViral's AI-powered video generator creates engaging social media content with a single click.",
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
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

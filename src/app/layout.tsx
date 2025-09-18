import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI视频生成器 - 无需编辑技能，一键创建病毒式社交媒体视频 | GenViral",
  description: "无需任何视频编辑技能！GenViral AI智能视频生成器让您一键创建引人入胜的社交媒体视频。支持抖音、Instagram、YouTube等平台，AI自动生成病毒式内容，提升社交媒体影响力。免费试用，快速上手！",
  keywords: "AI视频生成器, 无需编辑技能, 社交媒体视频, 病毒式视频, 一键生成视频, 抖音视频制作, Instagram视频, YouTube短视频, AI内容创作, 自动视频编辑, 社交媒体营销, 视频营销工具, 免费视频生成, 智能视频制作, 短视频创作",
  authors: [{ name: "GenViral Team" }],
  creator: "GenViral",
  publisher: "GenViral",
  robots: "index, follow",
  openGraph: {
    title: "AI视频生成器 - 无需编辑技能，一键创建病毒式社交媒体视频",
    description: "无需任何视频编辑技能！GenViral AI智能视频生成器让您一键创建引人入胜的社交媒体视频。",
    type: "website",
    locale: "zh_CN",
    siteName: "GenViral"
  },
  twitter: {
    card: "summary_large_image",
    title: "AI视频生成器 - 无需编辑技能，一键创建病毒式社交媒体视频",
    description: "无需任何视频编辑技能！GenViral AI智能视频生成器让您一键创建引人入胜的社交媒体视频。",
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

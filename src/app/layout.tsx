import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { AppHeader } from "@/components/layout/appHeader";
import "katex/dist/katex.min.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeInitScript = `
try {
  var savedTheme = localStorage.getItem('ise-theme');
  var theme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
  document.documentElement.dataset.theme = theme;
} catch (_) {
  document.documentElement.dataset.theme = 'dark';
}
`;

export const metadata: Metadata = {
  title: "問題管理UI",
  description: "作問した問題を一覧・進行・品質で管理する試作画面",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <AppHeader />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}

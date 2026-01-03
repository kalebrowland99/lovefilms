import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Love Films | Professional Wedding Videography",
  description: "Professional wedding videography services in Tennessee. Capturing your love story with stunning cinematography.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=AW-11434978629" 
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11434978629');
          `}
        </Script>

        {children}
        <Script 
          src="https://player.vimeo.com/api/player.js" 
          strategy="lazyOnload"
        />
        <Script 
          src="//embed.typeform.com/next/embed.js" 
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

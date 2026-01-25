import type { Metadata } from "next";
import { Merriweather, Nunito } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-serif",
});

const nunito = Nunito({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Horizon - Life Architecture",
  description: "Shared bucket list and life planning for couples",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Horizon",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F9F8F4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.variable} ${nunito.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

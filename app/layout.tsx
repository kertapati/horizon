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
  title: "Horizon",
  description: "Shared bucket list and life planning for couples",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
    ],
  },
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
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />

        {/* iOS PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Horizon" />
        <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" sizes="192x192" />
      </head>
      <body
        className={`${merriweather.variable} ${nunito.variable} antialiased`}
      >
        {children}
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

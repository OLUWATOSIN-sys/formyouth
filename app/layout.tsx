import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Suggestion Box",
  description: "Rccg Heaven's Gate Youth",
  icons: {
    icon: "https://www.rccg.org/wp-content/uploads/2020/11/rccg-for-web.png",
    shortcut: "https://www.rccg.org/wp-content/uploads/2020/11/rccg-for-web.png",
    apple: "https://www.rccg.org/wp-content/uploads/2020/11/rccg-for-web.png",
  },
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
        {children}
      </body>
    </html>
  );
}

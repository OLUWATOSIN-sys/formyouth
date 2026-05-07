import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IDENTITY 2026 | RCCG YAYA SA2",
  description:
    "Register for IDENTITY 2026 – RCCG YAYA SA2 Cape Town | Theme: TRANSFIGURED | June 16, 2026",
  icons: {
    icon: "/icon1.png",
    apple: "/icon1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}

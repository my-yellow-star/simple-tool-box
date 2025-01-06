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
  title: "Simple ToolBox",
  description: "Most Simple & Useful Online Tool Box",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta httpEquiv="Permissions-Policy" content="accelerometer=(self)" />
      <meta name="google" content="notranslate" />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Language" content="en" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen flex flex-col items-center`}
      >
        <div className="w-full max-w-[1000px]">{children}</div>
      </body>
    </html>
  );
}

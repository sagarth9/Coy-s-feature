import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coy - Discover",
  description: "Coy SDE Intern Assignment: Swipe-based Discover tab & Double-Blind Matching",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-neutral-950">
      <body className="min-h-full flex flex-col bg-neutral-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}

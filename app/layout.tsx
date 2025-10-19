import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/lib/ThemeRegistry";

export const metadata: Metadata = {
  title: "Admin Panel - Material UI 3",
  description: "Modern admin panel built with Next.js and Material UI 3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}

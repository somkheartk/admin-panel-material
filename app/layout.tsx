import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/lib/ThemeRegistry";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

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
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <ThemeRegistry>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI App Builder",
  description: "Describe your app in natural language, AI generates React code, see a live preview instantly, and deploy with one click.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}

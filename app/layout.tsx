import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI App Builder — Build apps with natural language",
  description:
    "Describe your app in plain language. AI generates the code. Live preview. One-click deploy.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}

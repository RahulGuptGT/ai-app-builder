import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AppBuilder — AI-Powered App Builder",
  description: "Describe your app in plain language. AI generates the code. Live preview. One-click deploy. Powered by Sarvam AI.",
  metadataBase: new URL("https://build.rahulgupta.in"),
  openGraph: {
    title: "AppBuilder — AI-Powered App Builder",
    description: "Build apps with natural language. Powered by Sarvam AI.",
    type: "website",
  },
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

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tele-Med Recorder POC",
  description: "iPhone-friendly video recording POC with Clerk + Vercel Blob"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="background-grid" />
          <div className="app-shell">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}

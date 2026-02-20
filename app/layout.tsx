import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
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
          <header className="nav">
            <Link href="/" style={{ textDecoration: "none", fontWeight: 700 }}>
              Tele-Med POC
            </Link>
            <div className="navLinks">
              <Link href="/record">Record</Link>
              <SignedOut>
                <Link className="button buttonAlt" href="/sign-in">
                  Sign in
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

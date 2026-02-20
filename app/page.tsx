import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      <section className="card" style={{ display: "grid", gap: "1rem" }}>
        <h1 style={{ margin: 0 }}>iPhone Video Recording POC</h1>
        <p style={{ margin: 0 }}>
          This app captures synchronized video + audio using one combined media stream and uploads test recordings to Vercel Blob.
        </p>

        <SignedOut>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/sign-in" className="button">
              Sign in
            </Link>
            <Link href="/sign-up" className="button buttonAlt">
              Create account
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          <Link href="/record" className="button">
            Go to Recorder
          </Link>
        </SignedIn>
      </section>
    </main>
  );
}

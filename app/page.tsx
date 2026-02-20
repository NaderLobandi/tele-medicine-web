import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="stack">
      <section className="logo">
        <h1>Kinematic Recorder</h1>
        <p>Tele-Medicine Research Platform</p>
      </section>

      <section className="card stack">
        <h2>Secure Access</h2>
        <p className="copy">Sign in to start synchronized camera + microphone recording and upload test files to Vercel Blob.</p>

        <SignedOut>
          <div className="nav-actions">
            <Link className="btn" href="/sign-in">
              Sign in
            </Link>
            <Link className="btn btn-secondary" href="/sign-up">
              Create account
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="button-group">
            <Link className="btn" href="/record">
              Open Recorder
            </Link>
          </div>
        </SignedIn>
      </section>
    </main>
  );
}

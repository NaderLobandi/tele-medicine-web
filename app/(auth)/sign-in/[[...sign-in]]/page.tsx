import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="stack">
      <section className="logo">
        <h1>Kinematic Recorder</h1>
        <p>Tele-Medicine Research Platform</p>
      </section>

      <section className="card stack">
        <SignIn forceRedirectUrl="/record" />
      </section>

      <Link href="/" className="btn btn-secondary">
        Back to home
      </Link>
    </main>
  );
}

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Recorder from "@/components/Recorder";

export default async function RecordPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="stack">
      <section className="logo">
        <h1>Kinematic Recorder</h1>
        <p>Tele-Medicine Research Platform</p>
      </section>

      <section className="card stack">
        <h2>Session</h2>
        <div className="pill-row">
          <div className="pill mono">User ID: {userId}</div>
          <div className="pill">POC only: test recordings, no PHI.</div>
        </div>
        <div className="nav-actions">
          <Link href="/" className="btn btn-secondary">
            Home
          </Link>
          <div style={{ display: "grid", placeItems: "center", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: 8 }}>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </section>

      <Recorder />
    </main>
  );
}

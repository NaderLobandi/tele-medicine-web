import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Recorder from "@/components/Recorder";

export default async function RecordPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main>
      <div className="grid">
        <Recorder />
        <section className="card" style={{ display: "grid", gap: "0.75rem", alignContent: "start" }}>
          <h2 style={{ margin: 0 }}>POC Notes</h2>
          <p style={{ margin: 0 }}>Use test data only. iPhone Safari recording stops if the screen locks.</p>
          <p style={{ margin: 0 }}>For best sync reliability, audio/video are captured in one media stream.</p>
          <p style={{ margin: 0 }}>Current storage target: Vercel Blob. Future migration target: OneDrive enterprise via Graph API upload sessions.</p>
        </section>
      </div>
    </main>
  );
}

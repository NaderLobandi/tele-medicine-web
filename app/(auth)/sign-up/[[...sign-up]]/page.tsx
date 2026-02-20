import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "80vh" }}>
      <SignUp forceRedirectUrl="/record" />
    </main>
  );
}

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "80vh" }}>
      <SignIn forceRedirectUrl="/record" />
    </main>
  );
}

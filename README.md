# Tele-Med Video Recorder POC

Next.js + Clerk + iPhone Safari recording + Vercel Blob upload.

## Implemented

- Clerk authentication with sign-in/sign-up routes
- Protected `/record` page and `/api/upload` endpoint
- iPhone-safe media permission flow (button-triggered `getUserMedia`)
- Single-stream audio+video capture via `MediaRecorder`
- Upload API storing to Vercel Blob as:
  - `recordings/{userId}/{timestamp}.webm`

## Required Environment Variables

Copy `.env.example` to `.env.local` and set values:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `BLOB_READ_WRITE_TOKEN`

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

1. Push repo to GitHub.
2. Import project in Vercel.
3. Add env vars in Vercel Project Settings.
4. Deploy.

Vercel provides HTTPS automatically, which is required for camera/mic access on iPhone Safari.

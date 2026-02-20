"use client";

import { useEffect, useRef, useState } from "react";

type UploadResult = {
  success: boolean;
  pathname?: string;
  url?: string;
  error?: string;
};

export default function Recorder() {
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const [ready, setReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("Tap Enable Camera and Mic to begin.");
  const [lastBlobUrl, setLastBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (lastBlobUrl) {
        URL.revokeObjectURL(lastBlobUrl);
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [lastBlobUrl]);

  const enableMedia = async () => {
    try {
      setStatus("Requesting camera/mic permission...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080 },
        audio: true
      });

      streamRef.current = stream;
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
      }

      setReady(true);
      setStatus("Ready to record.");
    } catch {
      setStatus("Permission denied or media device unavailable.");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      setStatus("Enable camera and mic first.");
      return;
    }

    const mimeType = MediaRecorder.isTypeSupported("video/webm")
      ? "video/webm"
      : "";

    try {
      chunksRef.current = [];
      const recorder = mimeType
        ? new MediaRecorder(streamRef.current, { mimeType })
        : new MediaRecorder(streamRef.current);

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const localUrl = URL.createObjectURL(blob);

        if (lastBlobUrl) {
          URL.revokeObjectURL(lastBlobUrl);
        }

        setLastBlobUrl(localUrl);
        await uploadRecording(blob);
      };

      recorderRef.current = recorder;
      recorder.start(1000);
      setIsRecording(true);
      setStatus("Recording...");
    } catch {
      setStatus("MediaRecorder failed to start on this device/browser.");
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current || recorderRef.current.state !== "recording") {
      return;
    }

    recorderRef.current.stop();
    setIsRecording(false);
    setStatus("Recording stopped. Uploading...");
  };

  const uploadRecording = async (blob: Blob) => {
    try {
      setIsUploading(true);
      const file = new File([blob], `recording_${new Date().toISOString()}.webm`, {
        type: "video/webm"
      });

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = (await response.json()) as UploadResult;
      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Upload failed");
      }

      setStatus(`Upload complete: ${data.pathname}`);
    } catch (error) {
      setStatus(error instanceof Error ? `Upload error: ${error.message}` : "Upload error.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="card" style={{ display: "grid", gap: "1rem" }}>
      <h2 style={{ margin: 0 }}>Recorder</h2>
      <p style={{ margin: 0 }}>{status}</p>

      <video ref={previewRef} autoPlay muted playsInline />

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button className="button" type="button" onClick={enableMedia} disabled={ready || isRecording || isUploading}>
          Enable Camera and Mic
        </button>

        <button className="button" type="button" onClick={startRecording} disabled={!ready || isRecording || isUploading}>
          Start
        </button>

        <button className="button buttonAlt" type="button" onClick={stopRecording} disabled={!isRecording || isUploading}>
          Stop
        </button>
      </div>

      {lastBlobUrl ? (
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <strong>Last local recording preview</strong>
          <video src={lastBlobUrl} controls playsInline />
        </div>
      ) : null}
    </section>
  );
}

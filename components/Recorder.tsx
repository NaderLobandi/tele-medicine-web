"use client";

import { useEffect, useRef, useState } from "react";

type UploadResult = {
  success: boolean;
  pathname?: string;
  url?: string;
  error?: string;
};

type StatusTone = "info" | "success" | "error";

export default function Recorder() {
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("Tap Enable Camera and Mic to begin.");
  const [statusTone, setStatusTone] = useState<StatusTone>("info");
  const [lastBlobUrl, setLastBlobUrl] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (lastBlobUrl) {
        URL.revokeObjectURL(lastBlobUrl);
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [lastBlobUrl]);

  const setStatusMessage = (message: string, tone: StatusTone = "info") => {
    setStatus(message);
    setStatusTone(tone);
  };

  const formatElapsed = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const startTimer = () => {
    startRef.current = Date.now();
    setElapsed("00:00:00");
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      if (!startRef.current) return;
      setElapsed(formatElapsed(Date.now() - startRef.current));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const enableMedia = async () => {
    try {
      setStatusMessage("Requesting camera and microphone permission...", "info");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080 },
        audio: true
      });

      streamRef.current = stream;
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
      }

      setReady(true);
      setStatusMessage("Permissions granted. Ready to record.", "success");
    } catch {
      setStatusMessage("Permission denied or media device unavailable.", "error");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) {
      setStatusMessage("Enable camera and mic first.", "error");
      return;
    }

    const mimeType = MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : "";

    try {
      chunksRef.current = [];
      const recorder = mimeType ? new MediaRecorder(streamRef.current, { mimeType }) : new MediaRecorder(streamRef.current);

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
      startTimer();
      setIsRecording(true);
      setStatusMessage("Recording in progress...", "info");
    } catch {
      setStatusMessage("MediaRecorder failed to start on this device/browser.", "error");
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current || recorderRef.current.state !== "recording") {
      return;
    }

    recorderRef.current.stop();
    stopTimer();
    setIsRecording(false);
    setStatusMessage("Recording stopped. Uploading...", "info");
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

      setStatusMessage(`Upload complete: ${data.pathname}`, "success");
    } catch (error) {
      setStatusMessage(error instanceof Error ? `Upload error: ${error.message}` : "Upload error.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="card stack">
      <h2>Recording Console</h2>
      <p className="copy">Use one stream for synchronized audio/video. Keep screen unlocked while recording on iPhone Safari.</p>

      <div className="video-preview">
        <video ref={previewRef} autoPlay muted playsInline />
        <div className="overlay-guide">
          <div className="guide-text">Position face in oval</div>
        </div>
        {isRecording ? (
          <div className="recording-indicator">
            <div className="recording-dot" />
            <span>RECORDING</span>
          </div>
        ) : null}
      </div>

      <div className="timer">{elapsed}</div>

      <div className={`status-message ${statusTone === "success" ? "status-success" : ""} ${statusTone === "error" ? "status-error" : ""}`}>
        {status}
      </div>

      <div className="button-group">
        <button className="btn" type="button" onClick={enableMedia} disabled={ready || isRecording || isUploading}>
          Enable Camera and Mic
        </button>

        <button className="btn" type="button" onClick={startRecording} disabled={!ready || isRecording || isUploading}>
          Start Recording
        </button>

        <button className="btn btn-error" type="button" onClick={stopRecording} disabled={!isRecording || isUploading}>
          Stop Recording
        </button>
      </div>

      {lastBlobUrl ? (
        <div className="stack">
          <h3>Local Playback</h3>
          <div className="video-preview">
            <video src={lastBlobUrl} controls playsInline />
          </div>
        </div>
      ) : null}
    </section>
  );
}

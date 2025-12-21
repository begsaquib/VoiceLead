import { useState, useRef } from "react";
import {
  Mic,
  Square,
  Loader2,
  CheckCircle2,
  XCircle,
  User,
  Building2,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

declare global {
  interface ImportMetaEnv {
    readonly VITE_N8N_WEBHOOK_URL: string;
    readonly VITE_DIRECTUS_URL: string;
    readonly VITE_DIRECTUS_TOKEN: string;
    readonly VITE_BOOTH_ID: string;
  }

  
}


type LeadFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

type ExtractedLead = {
  name: string;
  email: string;
  company: string;
  phone?: string;
  interest?: string;
};

// 🔐 Read config from env (same values you used in use-leads.ts)
const WEBHOOK_URL =
  "https://flow.wecommit.ai/webhook/91337cef-2e74-4cb0-b970-1f6af5a8956d";
const DIRECTUS_URL =
  (import.meta.env.VITE_DIRECTUS_URL as string | undefined) ?? "http://localhost:8055";
const DIRECTUS_TOKEN = import.meta.env.VITE_DIRECTUS_TOKEN as string | undefined;
const BOOTH_ID = import.meta.env.VITE_BOOTH_ID as string | undefined;

export function LeadForm({ onSuccess, onCancel }: LeadFormProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // AI‑extracted data (original) + editable copy
  const [extractedData, setExtractedData] = useState<ExtractedLead | null>(
    null
  );
  const [formData, setFormData] = useState<ExtractedLead | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // ------- Recording logic -------

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await processAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      setError("Could not access microphone. Please check permissions.");
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    }
  };

  // ------- Send to n8n -------

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64String = result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boothId: BOOTH_ID,
          audioData: base64Audio,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const lead: ExtractedLead = {
          name: result.data.name ?? "",
          email: result.data.email ?? "",
          company: result.data.company ?? "",
          phone: result.data.phone ?? "",
          interest: result.data.interest ?? "",
        };
        setExtractedData(lead);
        setFormData(lead);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to process audio. Please try again.");
      console.error("Processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // ------- Helpers -------

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const updateField = (field: keyof ExtractedLead, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      const res = await fetch(`${DIRECTUS_URL}/items/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
        },
        body: JSON.stringify({
          booth_id: BOOTH_ID,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone || null,
          interest: formData.interest || null,
          status: "new",
          source: "voice",
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Directus error:", text);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Lead created:", data);

      onSuccess();
    } catch (error) {
      console.error("Error creating lead:", error);
      setError("Failed to save lead. Please try again.");
    }
  };

  // ------- UI states -------

  // 1) Editable card with extracted data
  if (extractedData && formData) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
          Lead Captured!
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Review and edit the extracted information below.
        </p>

        <div className="space-y-4 mb-8">
          {/* Name */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <User className="w-4 h-4" />
              <span className="font-medium">Name</span>
            </div>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Mail className="w-4 h-4" />
              <span className="font-medium">Email</span>
            </div>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          {/* Company */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">Company</span>
            </div>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={formData.company}
              onChange={(e) => updateField("company", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Phone className="w-4 h-4" />
              <span className="font-medium">Phone</span>
            </div>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={formData.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>

          {/* Interest */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <FileText className="w-4 h-4" />
              <span className="font-medium">Interest</span>
            </div>
            <textarea
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              rows={3}
              value={formData.interest || ""}
              onChange={(e) => updateField("interest", e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all"
          >
            Save Lead
          </button>
        </div>
      </div>
    );
  }

  // 2) Processing state
  if (isProcessing) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
        <div className="mb-6">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Processing Audio...
        </h2>
        <p className="text-slate-500 max-w-sm mx-auto">
          AI is transcribing and extracting lead information.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    );
  }

  // 3) Recording / idle state
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="mb-8 relative">
        {isRecording ? (
          <>
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <button
              onClick={stopRecording}
              className="relative w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-500/40 hover:scale-105 active:scale-95 transition-all mx-auto group"
            >
              <Square className="w-12 h-12" />
            </button>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <button
              onClick={startRecording}
              className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all mx-auto group"
            >
              <Mic className="w-12 h-12 group-hover:animate-bounce" />
            </button>
          </>
        )}
      </div>

      {isRecording ? (
        <>
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-700 font-mono font-bold text-lg">
                {formatTime(recordingTime)}
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Recording...
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Speak clearly about the lead. Include name, company, email, and
            interests.
          </p>
          <button
            onClick={stopRecording}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            Stop & Process
          </button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Tap to Start Recording
          </h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Record your conversation or dictate lead details. The AI will
            automatically extract the information.
          </p>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700 font-medium transition-colors"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

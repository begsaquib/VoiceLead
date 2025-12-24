"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Loader2,
  CheckCircle2,
  XCircle,
  User,
  Building2,
  Mail,
  Phone,
  FileText,
  RotateCcw,
  ImageIcon,
  AlertCircle,
} from "lucide-react";
import { useImageExtract, fileToBase64 } from "../hooks/use-image-extract";
import { useIsMobile } from "../hooks/use-mobile";

type BusinessCardScannerProps = {
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

export function BusinessCardScanner({
  onSuccess,
  onCancel,
}: BusinessCardScannerProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);

  const [extractedData, setExtractedData] = useState<ExtractedLead | null>(
    null
  );
  const [formData, setFormData] = useState<ExtractedLead | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const imageExtract = useImageExtract();
  const isMobile = useIsMobile();

  const DIRECTUS_URL =
    (import.meta.env.VITE_DIRECTUS_URL as string | undefined) ??
    "https://b491837a4b1b.ngrok-free.app";
  const DIRECTUS_TOKEN =
    (import.meta.env.VITE_DIRECTUS_TOKEN as string | undefined) ??
    "s4emciM7GGjVs-tOkSF3jCiOLZCL-hje";
  const BOOTH_ID =
    (import.meta.env.VITE_BOOTH_ID as string | undefined) ??
    "67bbb618-a6ee-4ede-bd30-7e3d53eddfb6";

  const startCamera = async () => {
    setCameraPermissionDenied(false);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
      }
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setCameraPermissionDenied(true);
        setError(
          "Camera permission denied. Please enable camera access in your device settings."
        );
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device");
      } else {
        setError("Failed to access camera. Please try again.");
      }
      console.error("Camera access error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreamActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0);

    canvasRef.current.toBlob(
      async (blob) => {
        if (!blob) return;

        const file = new File([blob], "camera-capture.jpg", {
          type: "image/jpeg",
        });

        stopCamera();

        const previewUrl = URL.createObjectURL(blob);
        setCapturedImage(previewUrl);
        await processImage(file);
      },
      "image/jpeg",
      0.9
    );
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setError(null);

    const previewUrl = URL.createObjectURL(file);
    setCapturedImage(previewUrl);

    await processImage(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const base64Image = await fileToBase64(file);

      const result = await imageExtract.mutateAsync(base64Image);

      setExtractedData(result);
      setFormData(result);
    } catch (err: any) {
      setError(err?.message || "Failed to process image. Please try again.");
      console.error("Image processing error:", err);
      setCapturedImage(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateField = (field: keyof ExtractedLead, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedData(null);
    setFormData(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      const res = await fetch(`${DIRECTUS_URL}/items/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DIRECTUS_TOKEN}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          booth_id: BOOTH_ID,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone || null,
          interest: formData.interest || null,
          status: "new",
          source: "image",
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Directus error:", text);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Lead created from image:");

      setCapturedImage(null);
      setExtractedData(null);
      setFormData(null);
      setError(null);

      onSuccess();
    } catch (error) {
      console.error("Error creating lead:", error);
      setError("Failed to save lead. Please try again.");
    }
  };

  if (extractedData && formData) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
            <CheckCircle2 className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-center text-white mb-2 tracking-tighter">
          Card Scanned!
        </h2>
        <p className="text-center text-slate-300 mb-6 text-sm">
          Review and edit the extracted information below.
        </p>

        {capturedImage && (
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured business card"
                className="w-48 h-auto rounded-2xl border border-indigo-500/30 shadow-xl shadow-indigo-500/20"
              />
              <button
                onClick={handleRetake}
                className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur">
            <div className="flex items-center gap-2 text-xs text-slate-300 mb-2 uppercase tracking-wider font-semibold">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Name</span>
            </div>
            <input
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder-slate-500"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur">
            <div className="flex items-center gap-2 text-xs text-slate-300 mb-2 uppercase tracking-wider font-semibold">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Email</span>
            </div>
            <input
              type="email"
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder-slate-500"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur">
            <div className="flex items-center gap-2 text-xs text-slate-300 mb-2 uppercase tracking-wider font-semibold">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Company</span>
            </div>
            <input
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder-slate-500"
              value={formData.company}
              onChange={(e) => updateField("company", e.target.value)}
            />
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur">
            <div className="flex items-center gap-2 text-xs text-slate-300 mb-2 uppercase tracking-wider font-semibold">
              <Phone className="w-4 h-4 text-indigo-400" />
              <span>Phone</span>
            </div>
            <input
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder-slate-500"
              value={formData.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur">
            <div className="flex items-center gap-2 text-xs text-slate-300 mb-2 uppercase tracking-wider font-semibold">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Interest / Notes</span>
            </div>
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900/50 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder-slate-500"
              rows={3}
              value={formData.interest || ""}
              onChange={(e) => updateField("interest", e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-200 rounded-xl font-semibold hover:bg-slate-700/50 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:from-indigo-500 transition-all"
          >
            Save Lead
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-12 text-center">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-indigo-600/20 rounded-full blur-2xl mx-auto w-20 h-20" />
          <Loader2 className="w-16 h-16 animate-spin text-indigo-400 mx-auto relative" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
          Processing Image...
        </h2>
        <p className="text-slate-300 max-w-sm mx-auto">
          AI is analyzing the business card and extracting contact information.
        </p>

        {capturedImage && (
          <div className="mt-6 flex justify-center">
            <img
              src={capturedImage || "/placeholder.svg"}
              alt="Processing"
              className="w-32 h-auto rounded-xl border border-indigo-500/30 opacity-60"
            />
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2">
          <div
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    );
  }

  if (isStreamActive) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8 text-center">
        <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
          Capture Business Card
        </h2>
        <p className="text-slate-300 mb-6 text-sm">
          Position the business card clearly in view and tap capture
        </p>

        <div className="relative mb-6 rounded-2xl overflow-hidden bg-black border border-slate-700">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-96 object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-40 border-2 border-indigo-500/50 rounded-2xl" />
          </div>
        </div>

        <div className="flex gap-3 justify-center mb-4">
          <button
            onClick={capturePhoto}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-xl transition-all"
          >
            <Camera className="w-5 h-5" />
            Capture Photo
          </button>
          <button
            onClick={stopCamera}
            className="flex-1 px-6 py-3 bg-slate-800/50 border border-slate-700 text-slate-200 rounded-xl font-semibold hover:bg-slate-700/50 transition-colors"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Make sure the business card is well-lit and fully visible
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-12 text-center">
      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl flex items-start gap-3 backdrop-blur">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm font-semibold text-red-300">Error</p>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        </div>
      )}

      {cameraPermissionDenied && (
        <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/30 rounded-xl flex items-start gap-3 backdrop-blur">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-yellow-300">
              Camera Access Required
            </p>
            <p className="text-sm text-yellow-200">
              Please enable camera access in your device settings to use this
              feature.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-indigo-400" />
        </div>

        <div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">
            Scan Business Card
          </h2>
          <p className="text-slate-300 text-sm max-w-sm">
            Upload an image or capture a photo of a business card to extract
            contact information automatically
          </p>
        </div>

        {/* Drag and drop area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full p-8 rounded-2xl border-2 border-dashed transition-all ${
            isDragOver
              ? "border-indigo-500 bg-indigo-500/10"
              : "border-slate-600 hover:border-slate-500"
          }`}
        >
          <p className="text-slate-300 text-sm mb-4">
            Drag and drop your image here
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-lg hover:bg-indigo-600/30 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        {/* Camera button */}
        <button
          onClick={startCamera}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-xl transition-all w-full justify-center"
        >
          <Camera className="w-5 h-5" />
          Use Camera
        </button>
      </div>
    </div>
  );
}

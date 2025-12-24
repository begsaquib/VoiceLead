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
    Sparkles,
    ImageIcon,
} from "lucide-react";
import { useImageExtract, fileToBase64 } from "../hooks/use-image-extract";

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

    // AI-extracted data (original) + editable copy
    const [extractedData, setExtractedData] = useState<ExtractedLead | null>(null);
    const [formData, setFormData] = useState<ExtractedLead | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const imageExtract = useImageExtract();

    // Config (same as LeadForm)
    const DIRECTUS_URL =
        (import.meta.env.VITE_DIRECTUS_URL as string | undefined) ??
        "https://b491837a4b1b.ngrok-free.app";
    const DIRECTUS_TOKEN =
        (import.meta.env.VITE_DIRECTUS_TOKEN as string | undefined) ??
        "s4emciM7GGjVs-tOkSF3jCiOLZCL-hje";
    const BOOTH_ID =
        (import.meta.env.VITE_BOOTH_ID as string | undefined) ??
        "67bbb618-a6ee-4ede-bd30-7e3d53eddfb6";

    // ------- Image handling -------

    const handleFileSelect = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        setError(null);

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setCapturedImage(previewUrl);

        // Process image
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

    // ------- Process image via N8N -------

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
            // Reset image on error
            setCapturedImage(null);
        } finally {
            setIsProcessing(false);
        }
    };

    // ------- Helpers -------

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
                    source: "image", // Mark as image source
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Directus error:", text);
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            console.log("Lead created from image:");

            // Reset form
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
                    Card Scanned!
                </h2>
                <p className="text-center text-slate-500 mb-6">
                    Review and edit the extracted information below.
                </p>

                {/* Image thumbnail */}
                {capturedImage && (
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <img
                                src={capturedImage}
                                alt="Captured business card"
                                className="w-48 h-auto rounded-xl border border-slate-200 shadow-sm"
                            />
                            <button
                                onClick={handleRetake}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-700 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-4 mb-8">
                    {/* Name */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <User className="w-4 h-4" />
                            <span className="font-medium">Name</span>
                        </div>
                        <input
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
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
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
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
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
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
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                            value={formData.phone || ""}
                            onChange={(e) => updateField("phone", e.target.value)}
                        />
                    </div>

                    {/* Interest */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <FileText className="w-4 h-4" />
                            <span className="font-medium">Interest / Notes</span>
                        </div>
                        <textarea
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
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
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/30 hover:shadow-xl transition-all"
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
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse mx-auto w-20 h-20" />
                    <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto relative" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Processing Image...
                </h2>
                <p className="text-slate-500 max-w-sm mx-auto">
                    AI is analyzing the business card and extracting contact information.
                </p>

                {capturedImage && (
                    <div className="mt-6 flex justify-center">
                        <img
                            src={capturedImage}
                            alt="Processing"
                            className="w-32 h-auto rounded-xl border border-slate-200 opacity-60"
                        />
                    </div>
                )}

                <div className="mt-6 flex items-center justify-center gap-2">
                    <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                    />
                    <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                    />
                    <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                    />
                </div>
            </div>
        );
    }

    // 3) Idle / Capture state
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

            {/* Main capture area */}
            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-purple-500/40 mx-auto">
                    <Camera className="w-12 h-12" />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Scan Business Card
            </h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                Take a photo or upload an image of a business card. AI will extract
                contact details automatically.
            </p>

            {/* Action buttons */}
            <div className="flex gap-4 justify-center mb-8">
                <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/30 hover:bg-purple-700 hover:shadow-xl transition-all"
                >
                    <Camera className="w-5 h-5" />
                    Take Photo
                </button>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                    <Upload className="w-5 h-5" />
                    Upload Image
                </button>
            </div>

            {/* Hidden file inputs */}
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleInputChange}
                className="hidden"
            />
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />

            {/* Drag and drop zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 transition-all ${isDragOver
                    ? "border-purple-500 bg-purple-50"
                    : "border-slate-300 hover:border-slate-400"
                    }`}
            >
                <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                    {isDragOver ? (
                        <span className="text-purple-600 font-semibold">
                            Drop image here
                        </span>
                    ) : (
                        <>
                            Or drag and drop an image here
                        </>
                    )}
                </p>
            </div>

            {/* AI badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered OCR Extraction</span>
            </div>

            {/* Cancel button */}
            <button
                onClick={onCancel}
                className="mt-6 text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
                Cancel
            </button>
        </div>
    );
}

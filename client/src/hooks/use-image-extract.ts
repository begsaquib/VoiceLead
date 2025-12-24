import { useMutation } from "@tanstack/react-query";

type ExtractedLead = {
    name: string;
    email: string;
    company: string;
    phone?: string;
    interest?: string;
};

type ImageExtractResponse = {
    success: boolean;
    data?: ExtractedLead;
    error?: string;
};

// N8N webhook URL for image/OCR processing - configurable via environment
const IMAGE_WEBHOOK_URL =
    (import.meta.env.VITE_N8N_IMAGE_WEBHOOK_URL as string)

// Get booth ID from environment (same as voice capture)
const BOOTH_ID =
    (import.meta.env.VITE_BOOTH_ID as string)

/**
 * Hook for extracting lead information from business card images via AI OCR
 * Uses the same request/response format as voice audio processing
 */
export function useImageExtract() {
    return useMutation<ExtractedLead, Error, string>({
        mutationFn: async (imageBase64: string): Promise<ExtractedLead> => {
            console.log("📷 Sending image to N8N for OCR extraction...");

            const response = await fetch(IMAGE_WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    boothId: BOOTH_ID,
                    imageData: imageBase64, // base64-encoded image (same pattern as audioData)
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result: ImageExtractResponse = await response.json();
            console.log("✅ OCR extraction result:");

            if (result.success && result.data) {
                return {
                    name: result.data.name ?? "",
                    email: result.data.email ?? "",
                    company: result.data.company ?? "",
                    phone: result.data.phone ?? "",
                    interest: result.data.interest ?? "",
                };
            } else {
                throw new Error(result.error || "Failed to extract information from image");
            }
        },
    });
}

/**
 * Utility function to convert a File/Blob to base64 string
 */
export async function fileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            // Extract base64 content from data URL (remove "data:image/...;base64," prefix)
            const base64String = result.split(",")[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

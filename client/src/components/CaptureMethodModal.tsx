import { useNavigate } from "react-router-dom";
import { Mic, Camera, X } from "lucide-react";

type CaptureMethodModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CaptureMethodModal({
  isOpen,
  onClose,
}: CaptureMethodModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelect = (method: "voice" | "image") => {
    onClose();
    if (method === "voice") {
      navigate("/capture");
    } else {
      navigate("/image-scan");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-scaleIn"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-slate-600" />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
          Capture New Lead
        </h2>
        <p className="text-slate-500 text-center mb-8">
          Choose how you want to capture lead information
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleSelect("voice")}
            className="w-full p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Mic className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  Voice Capture
                </h3>
                <p className="text-sm text-slate-500">
                  Record conversation or dictate details
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleSelect("image")}
            className="w-full p-6 rounded-2xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">
                  Business Card Scan
                </h3>
                <p className="text-sm text-slate-500">
                  Scan or upload a business card
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

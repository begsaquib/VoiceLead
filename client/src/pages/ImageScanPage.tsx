import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { BusinessCardScanner } from "../components/BusinessCardScanner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ImageScanPage() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleSuccess = () => {
    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 mb-6 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="max-w-2xl mx-auto">
          <BusinessCardScanner onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </main>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-slide-up z-50">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">Lead saved successfully!</span>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { LeadForm } from "../components/LeadForm";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function VoiceCapturePage() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    // Show success message briefly
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // DON'T navigate - stay on /capture
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          {showSuccess && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">
                Lead saved successfully!
              </span>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <LeadForm
            onSuccess={handleSuccess}
            onCancel={() => navigate("/dashboard")}
          />
        </div>
      </main>
    </div>
  );
}

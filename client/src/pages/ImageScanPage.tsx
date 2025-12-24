"use client";

import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { BusinessCardScanner } from "../components/BusinessCardScanner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function ImageScanPage() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const handleSuccess = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 mb-8 text-slate-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold tracking-tight">
            Back to Dashboard
          </span>
        </button>

        <div className="max-w-2xl mx-auto">
          <BusinessCardScanner
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </main>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-indigo-500/30 flex items-center gap-3 animate-slide-up z-50 backdrop-blur-xl border border-indigo-400/20">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold tracking-tight">
            Lead saved successfully!
          </span>
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

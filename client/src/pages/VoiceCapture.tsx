"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { LeadForm } from "../components/LeadForm";
import { ArrowLeft, CheckCircle2 } from "lucide-react";


export default function VoiceCapturePage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070a] via-slate-950 to-[#0a0c10]">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-purple-600/10 blur-[180px] rounded-full animate-pulse delay-700" />
      </div>

      <Header />

      <main className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        <div className="flex items-center justify-between mb-8">
          

          {showSuccess && (
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-emerald-300 animate-in fade-in slide-in-from-right-4 duration-300 backdrop-blur-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="font-bold uppercase tracking-wider text-sm">
                Lead saved successfully!
              </span>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <LeadForm
            onSuccess={handleSuccess}
            onCancel={() => (window.location.href = "/dashboard")}
          />
        </div>
      </main>
    </div>
  );
}

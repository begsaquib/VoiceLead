import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { ArrowLeft, Camera, Upload } from "lucide-react";

export default function ImageScanPage() {
  const navigate = useNavigate();

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
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
              <button className="relative w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all mx-auto group">
                <Camera className="w-12 h-12 group-hover:animate-bounce" />
              </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Business Card Scanner
            </h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Capture or upload a business card image. AI will extract contact
              information automatically.
            </p>

            <div className="flex gap-4 justify-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-600/30 hover:bg-purple-700 transition-all">
                <Camera className="w-5 h-5" />
                Take Photo
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
                <Upload className="w-5 h-5" />
                Upload Image
              </button>
            </div>

            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-8">
              AI OCR Processing • Coming Soon
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

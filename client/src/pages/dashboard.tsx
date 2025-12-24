import { useState } from "react";
import { useLeads } from "../hooks/use-leads";
import { Header } from "../components/Header";
import { CaptureMethodModal } from "../components/CaptureMethodModal";
import {
  Download,
  Search,
  Loader2,
  Plus,
  User,
  Building2,
  Mail,
  Phone,
  LayoutDashboard,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: leads, isLoading } = useLeads();

  const exportLeads = () => {
    if (!leads || leads.length === 0) return;

    const headers = "Name,Company,Email,Phone,Interest,Date\n";
    const rows = leads
      .map((l) => {
        const d = l.date_created ? new Date(l.date_created) : null;
        const dateStr = d && !isNaN(d.getTime()) ? d.toLocaleDateString() : "";

        return `"${l.name}","${l.company}","${l.email}","${l.phone || ""}","${
          l.interest || ""
        }","${dateStr}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Your Leads</h2>

          <div className="flex gap-3 flex-wrap">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="Search leads..."
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <button
              onClick={exportLeads}
              disabled={!leads?.length}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Lead</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : leads && leads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map((lead) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {lead.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {lead.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {lead.company}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-full">
                    {lead.date_created
                      ? format(new Date(lead.date_created), "MMM d")
                      : "—"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                </div>

                {lead.interest && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">
                      Interest
                    </p>
                    <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
                      {lead.interest}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No leads captured yet
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              Start capturing leads using voice or business card scanning.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
            >
              Capture First Lead
            </button>
          </div>
        )}
      </main>

      <CaptureMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

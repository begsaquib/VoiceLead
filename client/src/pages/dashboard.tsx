// import { useState } from "react";
// import { useLeads } from "../hooks/use-leads";
// import { Header } from "../components/Header";
// import { CaptureMethodModal } from "../components/CaptureMethodModal";
// import {
//   Download,
//   Search,
//   Loader2,
//   Plus,
//   User,
//   Building2,
//   Mail,
//   Phone,
//   LayoutDashboard,
// } from "lucide-react";
// import { format } from "date-fns";
// import { motion } from "framer-motion";

// export default function DashboardPage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { data: leads, isLoading } = useLeads();

//   const exportLeads = () => {
//     if (!leads || leads.length === 0) return;

//     const headers = "Name,Company,Email,Phone,Interest,Date\n";
//     const rows = leads
//       .map((l) => {
//         const d = l.date_created ? new Date(l.date_created) : null;
//         const dateStr = d && !isNaN(d.getTime()) ? d.toLocaleDateString() : "";

//         return `"${l.name}","${l.company}","${l.email}","${l.phone || ""}","${
//           l.interest || ""
//         }","${dateStr}"`;
//       })
//       .join("\n");

//     const blob = new Blob([headers + rows], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `leads-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
//     a.click();
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />

//       <main className="max-w-5xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
//           <h2 className="text-2xl font-bold text-slate-900">Your Leads</h2>

//           <div className="flex gap-3 flex-wrap">
//             {/* <div className="relative hidden sm:block">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//               <input
//                 placeholder="Search leads..."
//                 className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//               />
//             </div> */}

//             <button
//               onClick={exportLeads}
//               disabled={!leads?.length}
//               className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
//             >
//               <Download className="w-4 h-4" />
//               <span className="hidden sm:inline">Export CSV</span>
//             </button>

//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl transition-all"
//             >
//               <Plus className="w-4 h-4" />
//               <span>New Lead</span>
//             </button>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//           </div>
//         ) : leads && leads.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {leads.map((lead) => (
//               <motion.div
//                 key={lead.id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
//                       {lead.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")
//                         .substring(0, 2)}
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-slate-900 text-sm">
//                         {lead.name}
//                       </h3>
//                       <p className="text-xs text-slate-500 flex items-center gap-1">
//                         <Building2 className="w-3 h-3" /> {lead.company}
//                       </p>
//                     </div>
//                   </div>
//                   <span className="text-[10px] font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-full">
//                     {lead.date_created
//                       ? format(new Date(lead.date_created), "MMM d")
//                       : "—"}
//                   </span>
//                 </div>

//                 <div className="space-y-2 mb-4">
//                   <div className="flex items-center gap-2 text-sm text-slate-600">
//                     <Mail className="w-3.5 h-3.5 text-slate-400" />
//                     <span className="truncate">{lead.email}</span>
//                   </div>
//                   {lead.phone && (
//                     <div className="flex items-center gap-2 text-sm text-slate-600">
//                       <Phone className="w-3.5 h-3.5 text-slate-400" />
//                       <span>{lead.phone}</span>
//                     </div>
//                   )}
//                 </div>

//                 {lead.interest && (
//                   <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
//                     <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">
//                       Interest
//                     </p>
//                     <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
//                       {lead.interest}
//                     </p>
//                   </div>
//                 )}
//               </motion.div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
//             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
//               <LayoutDashboard className="w-8 h-8" />
//             </div>
//             <h3 className="text-lg font-bold text-slate-900 mb-2">
//               No leads captured yet
//             </h3>
//             <p className="text-slate-500 max-w-sm mx-auto mb-6">
//               Start capturing leads using voice or business card scanning.
//             </p>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
//             >
//               Capture First Lead
//             </button>
//           </div>
//         )}
//       </main>

//       <CaptureMethodModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useLeads } from "../hooks/use-leads";
import { Header } from "../components/Header";
import { CaptureMethodModal } from "../components/CaptureMethodModal";
import {
  Download,
  Loader2,
  Plus,
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
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 -z-20 pointer-events-none opacity-30">
        <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-indigo-950 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-950 blur-[150px] rounded-full animate-pulse delay-700" />
      </div>

      <Header />

      <main className="max-w-6xl mx-auto px-12 lg:px-24 py-16 relative z-10">
        <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
          <h2 className="text-[64px] md:text-[80px] font-black tracking-tighter leading-none text-white">
            Your
            <br />
            <span className="text-slate-400 italic">Leads.</span>
          </h2>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={exportLeads}
              disabled={!leads?.length}
              className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl text-sm font-bold text-white hover:border-indigo-500/50 hover:bg-white/20 transition-all disabled:opacity-30 uppercase tracking-wider"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-3xl text-sm font-black shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:shadow-[0_30px_60px_rgba(79,70,229,0.4)] transition-all uppercase tracking-wider active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>New Lead</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32">
            <div className="flex flex-col items-center gap-6">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
              <p className="text-slate-400 font-medium">
                Loading your leads...
              </p>
            </div>
          </div>
        ) : leads && leads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map((lead) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-600/30">
                        {lead.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-black text-white text-lg">
                          {lead.name}
                        </h3>
                        <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                          <Building2 className="w-4 h-4" /> {lead.company}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black px-3 py-1.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 rounded-full uppercase tracking-wider">
                      {lead.date_created
                        ? format(new Date(lead.date_created), "MMM d")
                        : "—"}
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </div>

                  {lead.interest && (
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <p className="text-[10px] font-black text-indigo-400 mb-2 uppercase tracking-[0.3em]">
                        Interest
                      </p>
                      <p className="text-sm text-slate-200 line-clamp-3 leading-relaxed">
                        {lead.interest}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 space-y-6">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-lg text-slate-500 group-hover:text-indigo-400 transition-colors">
                <LayoutDashboard className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white mb-2">
                  No leads captured yet
                </h3>
                <p className="text-slate-400 max-w-sm mx-auto mb-8 text-lg">
                  Start capturing leads using voice or business card scanning.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all uppercase tracking-wider inline-block"
              >
                Capture First Lead
              </button>
            </div>
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

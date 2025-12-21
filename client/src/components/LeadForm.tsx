import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema, type InsertLead } from "@shared/schema";
import { useCreateLead } from "@/hooks/use-leads";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, Building2, User, Mail, Phone, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LeadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function LeadForm({ onSuccess, onCancel }: LeadFormProps) {
  const { toast } = useToast();
  const createLead = useCreateLead();
  const [isListening, setIsListening] = useState(false);

  // Mock prefilled data simulates "AI voice capture" result
  const form = useForm<InsertLead>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      name: "Alex Rivera",
      email: "alex@techcorp.com",
      company: "TechCorp Inc.",
      phone: "555-0123",
      interest: "Interested in the enterprise plan for Q3 rollout.",
    },
  });

  const onSubmit = async (data: InsertLead) => {
    try {
      await createLead.mutateAsync(data);
      toast({
        title: "Lead Saved Successfully",
        description: `${data.name} has been added to your dashboard.`,
        variant: "default",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error saving lead",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-blue-100 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-display">Review Captured Lead</h3>
          <p className="text-sm text-slate-500 mt-1">AI has extracted the following details</p>
        </div>
        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600">
          <Mic className="h-5 w-5" />
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> Name
            </label>
            <input
              {...form.register("name")}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="John Doe"
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" /> Company
            </label>
            <input
              {...form.register("company")}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Company Inc."
            />
            {form.formState.errors.company && (
              <p className="text-xs text-red-500">{form.formState.errors.company.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" /> Email
            </label>
            <input
              {...form.register("email")}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="john@example.com"
            />
             {form.formState.errors.email && (
              <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" /> Phone
            </label>
            <input
              {...form.register("phone")}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" /> Interest / Notes
          </label>
          <textarea
            {...form.register("interest")}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            placeholder="What is the lead interested in?"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createLead.isPending}
            className="px-6 py-2.5 rounded-xl font-semibold bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-95 disabled:opacity-70 disabled:pointer-events-none transition-all flex items-center gap-2"
          >
            {createLead.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              "Confirm & Save Lead"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

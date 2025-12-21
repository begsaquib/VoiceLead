import { Link } from "wouter";
import { ArrowRight, Mic, Sparkles, Database, CheckCircle, Smartphone, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                V
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-slate-900">VoiceLead</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
              <Link href="/app" className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-6">
              New: Voice-to-CRM Integration 🚀
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-slate-900 mb-6">
              Capture Trade Show Leads <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                in Seconds, Not Minutes
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Stop typing business cards manually. Just speak, and our AI instantly extracts lead details and syncs them to your dashboard.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-1">
                Start Capturing Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a href="#demo" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 transition-all bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300">
                View Demo
              </a>
            </div>
          </motion.div>

          {/* Social Proof */}
          <div className="mt-16 pt-8 border-t border-slate-200/60">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Trusted by sales teams at</p>
            <div className="flex justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Replaced with text placeholders as logos are not provided, using fonts to simulate logos */}
               <span className="text-xl font-bold font-display text-slate-800">ACME Corp</span>
               <span className="text-xl font-serif italic font-bold text-slate-800">GlobalTech</span>
               <span className="text-xl font-mono font-bold text-slate-800">SaaS.io</span>
               <span className="text-xl font-sans font-bold text-slate-800">FutureVentures</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 blur-3xl rounded-full" />
              <div className="relative bg-slate-50 p-8 rounded-3xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">The Old Way</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-600">
                    <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">✕</span>
                    Rented scanners cost $800+ per event
                  </li>
                  <li className="flex items-center text-slate-600">
                    <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">✕</span>
                    Manual typing leads to errors
                  </li>
                  <li className="flex items-center text-slate-600">
                    <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">✕</span>
                    Leads get lost in pockets and bags
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-6">
                Why pay $800 for a scanner?
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Badge scanners are clunky, expensive, and don't capture context. VoiceLead turns your phone into an intelligent capture device for a fraction of the cost.
              </p>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 inline-block">
                <span className="block text-sm font-semibold text-blue-600 mb-1">VoiceLead Pro</span>
                <span className="text-4xl font-bold text-slate-900">$99</span>
                <span className="text-slate-500">/event</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900">How it works</h2>
            <p className="mt-4 text-lg text-slate-600">Three simple steps to better lead management</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Mic, title: "1. Speak", desc: "After talking to a prospect, simply dictate their info and your notes." },
              { icon: Sparkles, title: "2. AI Extracts", desc: "Our engine instantly structures the unstructured voice data." },
              { icon: Database, title: "3. Save & Sync", desc: "Review the details and save directly to your dashboard." },
            ].map((step, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">Ready to upgrade your booth?</h2>
          <p className="text-xl text-slate-300 mb-10">
            Join thousands of modern sales teams capturing more leads with less friction.
          </p>
          <Link href="/app" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white rounded-2xl shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-1">
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white text-xs font-bold">V</div>
              <span className="font-bold text-slate-900">VoiceLead</span>
            </div>
            <div className="text-slate-500 text-sm">
              © {new Date().getFullYear()} VoiceLead Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

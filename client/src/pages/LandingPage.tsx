
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Mic, Camera, QrCode, CheckCircle2, Globe, Smartphone, Database, Layers, BarChart3, Users, Building2, Rocket, Clock } from 'lucide-react';


const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-x-hidden font-['Plus_Jakarta_Sans']">
            {/* Dynamic Background */}
            <div className="fixed inset-0 -z-20 pointer-events-none opacity-40">
                <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-slate-100 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-50 blur-[150px] rounded-full animate-pulse delay-700" />
            </div>

            {/* Navigation */}
            <nav className="flex items-center justify-between px-12 lg:px-24 py-12 max-w-screen-2xl mx-auto sticky top-0 bg-white/80 backdrop-blur-xl z-[100] border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-2xl text-white shadow-xl">
                        <Mic size={24} />
                    </div>
                    <span className="text-3xl font-black tracking-tighter">VoiceLead</span>
                </div>
                <div className="hidden lg:flex items-center gap-16 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                    <button onClick={() => scrollToSection('features')} className="hover:text-black transition-all hover:translate-y-[-1px]">Features</button>
                    <button onClick={() => scrollToSection('how-it-works')} className="hover:text-black transition-all hover:translate-y-[-1px]">How It Works</button>
                    <button onClick={() => scrollToSection('built-for')} className="hover:text-black transition-all hover:translate-y-[-1px]">Built For</button>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-black text-white px-10 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest hover:scale-105 hover:bg-indigo-600 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] active:scale-95"
                >
                    Start Capturing
                </button>
            </nav>

            {/* Hero Section */}
            <section className="px-12 lg:px-24 pt-32 pb-48 max-w-screen-2xl mx-auto text-center relative">
                <div className="space-y-16 relative z-10">
                    <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-slate-100 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 bg-white/80 backdrop-blur-md shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles size={16} className="text-indigo-600" /> AI-Powered Lead Capture
                    </div>

                    <div className="relative">
                        <h1 className="text-[120px] md:text-[200px] font-black tracking-tighter leading-[0.75] text-black transition-all animate-in zoom-in-95 duration-1000">
                            Capture<br />
                            <span className="text-slate-100 italic">Leads.</span>
                        </h1>
                    </div>

                    <p className="text-2xl lg:text-5xl text-slate-400 max-w-5xl mx-auto font-medium leading-[1.15] tracking-tight mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        Tired of typing contact details? <span className="text-black font-bold">Speak, snap, or scan</span> — our AI extracts lead info in seconds and syncs to your dashboard.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="group w-full md:w-auto bg-black text-white px-20 py-10 rounded-[56px] font-black text-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-6 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.4)] active:scale-95"
                        >
                            Start Free <ArrowRight size={36} className="group-hover:translate-x-4 transition-transform duration-500" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Marquee */}
            <section id="features" className="bg-slate-950 py-12 border-y border-white/5 overflow-hidden">
                <div className="flex items-center gap-32 whitespace-nowrap animate-marquee">
                    {[
                        { icon: Mic, text: "Voice Capture" },
                        { icon: Camera, text: "Card Scanning" },
                        { icon: QrCode, text: "QR Code Reader" },
                        { icon: Zap, text: "AI Extraction" },
                        { icon: Database, text: "CRM Sync" },
                        { icon: Globe, text: "Trade Show Ready" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-all group">
                            <item.icon size={28} className="text-indigo-500" />
                            <span className="text-4xl font-black tracking-tighter uppercase text-white group-hover:text-indigo-400">{item.text}</span>
                        </div>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {[
                        { icon: Mic, text: "Voice Capture" },
                        { icon: Camera, text: "Card Scanning" },
                        { icon: QrCode, text: "QR Code Reader" },
                        { icon: Zap, text: "AI Extraction" },
                        { icon: Database, text: "CRM Sync" },
                        { icon: Globe, text: "Trade Show Ready" },
                    ].map((item, i) => (
                        <div key={`dup-${i}`} className="flex items-center gap-6 opacity-40 hover:opacity-100 transition-all group">
                            <item.icon size={28} className="text-indigo-500" />
                            <span className="text-4xl font-black tracking-tighter uppercase text-white group-hover:text-indigo-400">{item.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works - Dark Technical Section */}
            <section id="how-it-works" className="bg-slate-950 text-white px-12 lg:px-24 py-64 relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="max-w-screen-2xl mx-auto space-y-32">
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
                        <div className="space-y-8 max-w-4xl">
                            <span className="text-sm font-black text-indigo-400 uppercase tracking-[0.5em] block">Three Simple Steps</span>
                            <h2 className="text-[80px] md:text-[140px] font-black tracking-tighter leading-[0.8] text-white">How It<br />Works.</h2>
                        </div>
                        <p className="text-2xl text-slate-500 font-medium max-w-md leading-relaxed pb-6">
                            From voice notes to organized leads in seconds. Capture contacts your way.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                        {/* Speak / Snap / Scan */}
                        <div className="lg:col-span-4 bg-[#0a0c10] border border-white/5 rounded-[64px] p-16 flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-700 group relative overflow-hidden h-[600px]">
                            <div className="absolute top-0 right-0 p-12 text-white/5 font-black text-[120px] pointer-events-none group-hover:text-indigo-500/10 transition-colors">01</div>
                            <div className="space-y-12 relative z-10">
                                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_20px_40px_rgba(79,70,229,0.3)] group-hover:scale-110 transition-transform">
                                    <Mic size={32} />
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-5xl font-black tracking-tighter">Capture.</h3>
                                    <p className="text-xl text-slate-400 font-medium leading-relaxed">
                                        <span className="text-white font-bold">Speak</span> your notes, <span className="text-white font-bold">snap</span> a business card, or <span className="text-white font-bold">scan</span> a QR code. Use whatever method works best in the moment.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-400 relative z-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                                Voice, Camera & QR
                            </div>
                        </div>

                        {/* AI Extract */}
                        <div className="lg:col-span-8 bg-[#0a0c10] border border-white/5 rounded-[64px] p-16 hover:border-indigo-500/50 transition-all duration-700 group relative overflow-hidden flex flex-col justify-between h-[600px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex justify-between items-start relative z-10">
                                <div className="w-20 h-20 bg-white text-black rounded-3xl flex items-center justify-center shadow-2xl">
                                    <Sparkles size={32} />
                                </div>
                                <div className="text-white/5 font-black text-[120px] pointer-events-none">02</div>
                            </div>
                            <div className="space-y-8 relative z-10">
                                <h3 className="text-7xl font-black tracking-tighter">Extract.</h3>
                                <p className="text-3xl text-slate-400 font-medium leading-tight max-w-3xl">
                                    Our AI instantly structures the data — names, companies, emails, phone numbers, and your custom notes. No manual typing required.
                                </p>
                                <div className="flex gap-12 pt-8">
                                    <div className="space-y-1">
                                        <p className="text-white font-black text-2xl">Gemini AI</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Powered By Google</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white font-black text-2xl">&lt; 5s</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Average Processing</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sync */}
                        <div className="lg:col-span-12 bg-white text-black rounded-[72px] p-20 flex flex-col lg:flex-row items-center justify-between gap-16 group hover:shadow-[0_80px_160px_-40px_rgba(0,0,0,0.5)] transition-all duration-1000">
                            <div className="space-y-12 flex-1">
                                <div className="w-24 h-24 bg-black text-white rounded-[32px] flex items-center justify-center group-hover:rotate-12 transition-transform shadow-2xl">
                                    <Database size={40} />
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-[80px] font-black tracking-tighter leading-none">Sync.</h3>
                                    <p className="text-3xl text-slate-400 font-medium leading-relaxed max-w-3xl">
                                        Review, edit if needed, and save directly to your dashboard. All your leads organized, searchable, and ready for follow-up.
                                    </p>
                                </div>
                            </div>
                            <div className="w-full lg:w-[480px] h-[400px] bg-slate-50 rounded-[56px] border border-slate-100 shadow-inner relative overflow-hidden p-12 group-hover:scale-[1.02] transition-transform duration-700">
                                <div className="space-y-6 opacity-40">
                                    <div className="w-full h-4 bg-slate-200 rounded-full" />
                                    <div className="w-5/6 h-4 bg-slate-200 rounded-full" />
                                    <div className="w-2/3 h-4 bg-slate-200 rounded-full" />
                                    <div className="w-3/4 h-4 bg-slate-200 rounded-full" />
                                </div>
                                <div className="absolute bottom-12 right-12 flex flex-col items-end gap-6">
                                    <div className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl animate-bounce">
                                        Lead Captured
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Built For - Professional Section */}
            <section id="built-for" className="bg-[#05070a] text-white px-12 lg:px-24 py-80 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-0 w-full h-[1px] bg-indigo-500/20 shadow-[0_0_20px_indigo]" />
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-indigo-500/20 shadow-[0_0_20px_indigo]" />
                    <div className="absolute top-3/4 left-0 w-full h-[1px] bg-indigo-500/20 shadow-[0_0_20px_indigo]" />
                    <div className="absolute top-0 left-1/4 h-full w-[1px] bg-indigo-500/20 shadow-[0_0_20px_indigo]" />
                    <div className="absolute top-0 left-1/2 h-full w-[1px] bg-indigo-500/20 shadow-[0_0_20px_indigo]" />
                    <div className="absolute top-0 left-3/4 h-full w-[1px] bg-indigo-500/20 shadow-[0_0_20px_indigo]" />
                </div>

                <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 relative z-10">
                    <div className="lg:col-span-7 space-y-24">
                        <div className="space-y-8">
                            <span className="text-sm font-black text-indigo-400 uppercase tracking-[0.5em] block">Perfect For</span>
                            <h2 className="text-[100px] md:text-[180px] font-black tracking-tighter leading-[0.75] text-white">Built<br />For.</h2>
                            <p className="text-3xl text-slate-400 font-medium leading-relaxed max-w-2xl">
                                Whether you're at a busy trade show booth or networking at a conference, VoiceLead adapts to your workflow.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {[
                                { title: "Trade Show Teams", desc: "Capture hundreds of leads without expensive badge scanners. Just speak or snap.", icon: Users },
                                { title: "Sales & Biz Dev", desc: "Never lose a contact again. Voice notes capture context that cards can't.", icon: BarChart3 },
                                { title: "Enterprise Teams", desc: "Seamless dashboard integration with analytics and export features.", icon: Building2 },
                                { title: "Startups", desc: "Cost-effective alternative to $800+ scanner rentals. Works on any phone.", icon: Rocket }
                            ].map((item, idx) => (
                                <div key={idx} className="group p-8 bg-white/5 border border-white/10 rounded-[40px] hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-500">
                                    <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                                        <item.icon size={24} />
                                    </div>
                                    <h4 className="text-2xl font-black tracking-tight mb-2">{item.title}</h4>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse group-hover:bg-indigo-600/40 transition-all duration-1000" />
                            <div className="bg-[#0a0c10] border-2 border-indigo-500/30 rounded-[80px] p-16 aspect-square flex flex-col justify-between backdrop-blur-3xl relative z-10 shadow-[0_0_100px_rgba(79,70,229,0.1)]">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
                                        <Zap size={32} className="text-indigo-400" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Processing</span>
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <p className="text-8xl font-black tracking-tighter text-white">&lt;5s</p>
                                        <p className="text-xl font-bold text-slate-500">Average Lead Capture Time</p>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-[95%] h-full bg-gradient-to-r from-indigo-600 to-indigo-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Call to Action */}
            <section className="px-12 lg:px-24 py-80 text-center space-y-24 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-slate-50 blur-[200px] -z-10 rounded-full" />
                <h2 className="text-[120px] md:text-[220px] font-black tracking-tighter leading-none text-black">Start<br />Capturing.</h2>
                <div className="space-y-12">
                    <p className="text-3xl text-slate-400 font-medium max-w-2xl mx-auto">Transform your lead capture workflow. No expensive scanners. No manual typing. Just speak, snap, or scan.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="group bg-black text-white px-24 py-12 rounded-[64px] font-black text-4xl hover:scale-105 hover:bg-indigo-600 transition-all shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)] active:scale-95"
                    >
                        Get Started Free
                    </button>
                </div>
            </section>

            <footer className="px-12 lg:px-24 py-32 border-t border-slate-50 bg-slate-50/20">
                <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-24 opacity-30 grayscale hover:opacity-100 transition-all duration-700">
                    <div className="flex items-center gap-4">
                        <Mic size={28} className="text-indigo-600" />
                        <span className="text-3xl font-black tracking-tighter">VoiceLead</span>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-500">© 2025 VoiceLead. Powered by Google Gemini AI.</p>
                </div>
            </footer>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default LandingPage;

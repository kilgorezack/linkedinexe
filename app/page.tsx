"use client";

import { useState } from "react";

const MAX_CHARS = 5000;

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const translate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      let data: { result?: string; error?: string };
      try {
        data = await res.json();
      } catch {
        throw new Error("Unexpected response from server. A network proxy or firewall may be blocking the request.");
      }
      if (!res.ok) throw new Error(data.error || "Translation failed");
      setOutput(data.result ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Header */}
      <header className="bg-surface sticky top-0 z-50 border-b border-slate-100">
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container text-3xl">translate</span>
            <span className="font-headline font-extrabold text-primary-container text-2xl tracking-tight">LinkedIn.exe</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm mr-2 text-base">search</span>
              <span className="text-sm font-body">Search posts...</span>
            </div>
            <div className="flex gap-1">
              <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              </button>
              <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">settings</span>
              </button>
              <div className="w-9 h-9 rounded-full bg-[#f4a261] flex items-center justify-center ml-1">
                <span className="text-white text-sm font-bold">U</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Nav */}
      <nav className="hidden md:flex bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto w-full px-6 flex gap-8">
          <a href="#" className="py-3 text-primary-container border-b-2 border-primary-container font-medium text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">translate</span>
            Translate
          </a>
          <a href="#" className="py-3 text-on-surface-variant hover:text-on-surface font-medium text-sm flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-[20px]">history</span>
            History
          </a>
          <a href="#" className="py-3 text-on-surface-variant hover:text-on-surface font-medium text-sm flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-[20px]">star</span>
            Saved
          </a>
          <a href="#" className="py-3 text-on-surface-variant hover:text-on-surface font-medium text-sm flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Post
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 pb-32 md:pb-24">
        {/* Language Selector */}
        <div className="bg-white rounded-t-2xl flex items-center overflow-x-auto">
          <div className="flex items-center min-w-max px-4">
            <button className="px-4 py-4 text-primary-container font-semibold text-sm border-b-2 border-primary-container">
              Normal Human
            </button>
            <div className="mx-2 p-2 rounded-full hover:bg-surface-container-low cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">swap_horiz</span>
            </div>
            <button className="px-4 py-4 text-on-surface-variant font-medium text-sm hover:bg-surface-container-low transition-colors">
              LinkedIn Lunatic
            </button>
          </div>
          <div className="ml-auto px-4">
            <button className="p-2 text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>
        </div>

        {/* Translation Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline-variant/20 border-x border-b border-slate-100/50 rounded-b-2xl overflow-hidden shadow-sm">
          {/* Input */}
          <div className="bg-white p-4 sm:p-6 flex flex-col min-h-[45vh] md:min-h-[50vh]">
            <textarea
              className="w-full flex-grow border-none focus:ring-0 text-lg sm:text-xl md:text-2xl text-on-surface placeholder-on-surface-variant/30 resize-none font-body bg-transparent outline-none"
              placeholder="What are you thinking?"
              value={input}
              maxLength={MAX_CHARS}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="mt-auto flex justify-between items-center pt-3">
              <div className="flex gap-1">
                <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
                  <span className="material-symbols-outlined">mic</span>
                </button>
                <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
                  <span className="material-symbols-outlined">volume_up</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-on-surface-variant font-label">
                  {input.length} / {MAX_CHARS}
                </span>
                <button
                  onClick={translate}
                  disabled={!input.trim() || loading}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #005bbf, #1a73e8)" }}
                >
                  {loading ? "..." : "Translate"}
                </button>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="bg-surface-container-low/50 p-4 sm:p-6 flex flex-col min-h-[45vh] md:min-h-[50vh]">
            <div className="flex-grow">
              {loading ? (
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary-container rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-primary-container rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-primary-container rounded-full animate-bounce" />
                  </div>
                  <span className="text-sm font-body italic">Disrupting synergy...</span>
                </div>
              ) : error ? (
                <p className="text-error text-sm font-body">{error}</p>
              ) : output ? (
                <p className="text-lg md:text-xl text-on-surface font-body leading-relaxed whitespace-pre-wrap">
                  {output}
                </p>
              ) : (
                <p className="text-lg md:text-xl text-on-surface-variant/60 font-body leading-relaxed italic">
                  The translation will appear here. Get ready to disrupt the synergy. 🚀
                </p>
              )}
            </div>
            <div className="mt-auto flex justify-between items-center pt-4">
              <div className="flex gap-1">
                <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
                  <span className="material-symbols-outlined">volume_up</span>
                </button>
                <button
                  onClick={copyOutput}
                  className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
                  title={copied ? "Copied!" : "Copy"}
                >
                  <span className="material-symbols-outlined">{copied ? "check" : "content_copy"}</span>
                </button>
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
                  <span className="material-symbols-outlined">thumb_up</span>
                </button>
                <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bento CTA Section */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div
            className="md:col-span-2 p-6 md:p-8 rounded-[2rem] text-white flex flex-col justify-between overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, #005bbf, #1a73e8)" }}
          >
            <div className="relative z-10">
              <h2 className="font-headline text-3xl mb-4">Ready to reach the C-Suite?</h2>
              <p className="font-body opacity-90 max-w-md text-base">
                Our AI analyzes over 4 million cringeworthy posts to ensure your personal brand is maximally disruptive.
              </p>
            </div>
            <div className="mt-8 relative z-10">
              <button
                onClick={translate}
                disabled={!input.trim() || loading}
                className="bg-white text-primary px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Translating..." : "Translate to Lunatic"}
              </button>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-secondary-container p-6 md:p-8 rounded-[2rem] flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined material-symbols-filled text-on-secondary-container text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <h3 className="font-headline text-on-secondary-container text-xl mb-2">Auto-Buzzword</h3>
            <p className="font-body text-on-secondary-container text-sm">
              Automatically injects &quot;Synergy&quot;, &quot;Leverage&quot;, and &quot;Holistic&quot; into every sentence.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-slate-200/50 mt-12 pb-24 md:pb-8">
        <div className="flex flex-wrap justify-center gap-6 px-8 py-8 w-full max-w-7xl mx-auto">
          {["Feedback", "Privacy & Terms", "Help Center", "Ad Choices"].map((link) => (
            <a key={link} href="#" className="font-label text-xs tracking-wide text-on-surface-variant hover:text-primary-container transition-colors">
              {link}
            </a>
          ))}
          <div className="w-full text-center mt-2">
            <p className="font-label text-xs tracking-wide text-on-surface-variant/60">© 2026 <a href="https://www.summitlabs.one/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-container transition-colors">Summit Labs</a></p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 rounded-t-2xl bg-white/80 backdrop-blur-xl border-t border-slate-100/10 shadow-[0px_-12px_32px_0px_rgba(25,28,29,0.06)] flex justify-around items-center px-4 pb-6 pt-2">
        {[
          { icon: "translate", label: "Translate", active: true },
          { icon: "history", label: "History", active: false },
          { icon: "star", label: "Saved", active: false },
          { icon: "add_circle", label: "Post", active: false },
        ].map(({ icon, label, active }) => (
          <button
            key={label}
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-1 transition-all active:scale-90 ${
              active ? "bg-secondary-container/50 text-primary-container" : "text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span className="font-label text-[11px] font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={translate}
        disabled={!input.trim() || loading}
        className="fixed right-6 bottom-24 md:bottom-12 z-40 text-white p-4 rounded-2xl shadow-[0px_12px_32px_0px_rgba(25,28,29,0.2)] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ background: "linear-gradient(135deg, #005bbf, #1a73e8)" }}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
        <span className="font-bold font-body pr-2">{loading ? "Disrupting..." : "Instant Disrupt"}</span>
      </button>
    </div>
  );
}

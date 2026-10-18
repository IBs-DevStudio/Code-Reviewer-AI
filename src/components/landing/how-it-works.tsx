"use client";

import { FaGithub } from "react-icons/fa";
import { GitPullRequest, Sparkles, ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: FaGithub,
    title: "Connect a repository",
    description: "Link your GitHub account and select the repos you want to enable.",
  },
  {
    step: "02",
    icon: GitPullRequest,
    title: "Open a pull request",
    description:
      "Work as usual. When you open a pull request, Orynd automatically steps in.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Review with more signal",
    description:
      "Get clear, contextual feedback with suggested fixes, edge cases, and security considerations.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#030d22] py-24 text-white"
    >
      {/* Background Cyan Glow Light Flare */}
      <div className="pointer-events-none absolute -top-40 left-1/4 -z-0 size-[700px] rounded-full bg-cyan-500/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 right-10 -z-0 size-[550px] rounded-full bg-blue-600/20 blur-[130px]" />

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Top-Right Curved Badge */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-16">
          <div className="space-y-3 max-w-2xl">
            <span className="font-funky text-sm sm:text-base font-bold tracking-widest uppercase text-sky-400">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Fits right into{" "}
              <span className="text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                your flow.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Get valuable, context-aware feedback in three simple steps, right where your team already works.
            </p>
          </div>

          {/* Top-Right Decorative "SAME FLOW, HIGHER STANDARDS" handwritten annotation with curved arrow */}
          <div className="hidden lg:flex flex-col items-end gap-1 self-start -rotate-3 transition-transform hover:rotate-0">
            <div className="flex items-center gap-2 border border-sky-400/30 bg-sky-950/70 rounded-full px-4 py-1.5 backdrop-blur-md shadow-lg shadow-sky-950/50">
              <Sparkles className="size-3.5 text-sky-400 animate-pulse" />
              <span className="font-funky text-base sm:text-lg tracking-wider text-sky-300 uppercase">
                SAME FLOW, HIGHER STANDARDS.
              </span>
            </div>
            {/* Hand-drawn curved arrow pointing down toward the steps */}
           
           
          </div>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 lg:gap-6 items-center">
          {/* Step 1 */}
          <div className="md:col-span-3 rounded-2xl border border-sky-500/20 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-sky-400/40 hover:-translate-y-1">
            <div className="flex items-center justify-between pb-6">
              <span className="rounded-full bg-sky-500/20 border border-sky-400/30 px-3 py-1 text-xs font-bold font-mono text-sky-300">
                {STEPS[0].step}
              </span>
              <div className="size-9 rounded-full bg-white/10 flex items-center justify-center text-white">
                <FaGithub className="size-5" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{STEPS[0].title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{STEPS[0].description}</p>
          </div>

          {/* Connector Arrow 1 */}
          <div className="hidden md:flex md:col-span-1 justify-center text-sky-400/60">
            <ArrowRight className="size-6 animate-pulse" />
          </div>

          {/* Step 2 */}
          <div className="md:col-span-3 rounded-2xl border border-sky-500/20 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-sky-400/40 hover:-translate-y-1">
            <div className="flex items-center justify-between pb-6">
              <span className="rounded-full bg-sky-500/20 border border-sky-400/30 px-3 py-1 text-xs font-bold font-mono text-sky-300">
                {STEPS[1].step}
              </span>
              <div className="size-9 rounded-full bg-white/10 flex items-center justify-center text-sky-300">
                <GitPullRequest className="size-5" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{STEPS[1].title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{STEPS[1].description}</p>
          </div>

          {/* Connector Arrow 2 */}
          <div className="hidden md:flex md:col-span-1 justify-center text-sky-400/60">
            <ArrowRight className="size-6 animate-pulse" />
          </div>

          {/* Step 3 */}
          <div className="md:col-span-3 rounded-2xl border border-sky-500/20 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-sky-400/40 hover:-translate-y-1">
            <div className="flex items-center justify-between pb-6">
              <span className="rounded-full bg-sky-500/20 border border-sky-400/30 px-3 py-1 text-xs font-bold font-mono text-sky-300">
                {STEPS[2].step}
              </span>
              <div className="size-9 rounded-full bg-white/10 flex items-center justify-center text-sky-300">
                <Sparkles className="size-5" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{STEPS[2].title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{STEPS[2].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

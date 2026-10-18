"use client";

import { Sparkles, ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-[#030e2a] py-28 text-white">
      {/* Background Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radiant Glowing Cyan Arc Flare across the bottom */}
      <div className="pointer-events-none absolute -bottom-48 left-1/2 -translate-x-1/2 w-[110%] h-[320px] rounded-[100%] bg-gradient-to-t from-cyan-400/40 via-sky-500/20 to-transparent blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_35px_#38bdf8]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-950/60 px-4 py-1.5 text-xs sm:text-sm font-funky uppercase tracking-wider text-sky-300 backdrop-blur-md shadow-inner">
          <Sparkles className="size-3.5 text-sky-400 animate-pulse" />
          <span>Same code. A brighter tomorrow.</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Make room for{" "}
          <span className="text-sky-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
            better reviews.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Give your team the clarity, context,{" "}
          <span className="font-semibold text-white">and confidence</span> to ship.
        </p>

        {/* Button */}
        <div className="pt-2 space-y-3">
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm sm:text-base font-bold text-slate-900 shadow-xl shadow-cyan-500/20 transition-all duration-200 hover:bg-slate-100 hover:scale-105 active:scale-95"
          >
            See how it works
            <ArrowRight className="size-4" />
          </a>

          {/* Playful Sticky Note */}
          <div>
            <span className="font-funky text-base sm:text-lg text-sky-300/90  inline-block">
              ⚡ Takes less than 2 minutes to install on your repository
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

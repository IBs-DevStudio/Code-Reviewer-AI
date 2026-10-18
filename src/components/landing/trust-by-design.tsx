"use client";

import { MessageSquare, Users, ShieldCheck } from "lucide-react";

export function TrustByDesign() {
  return (
    <section className="py-20 bg-slate-50/50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-blue-100 dark:border-white/10 bg-gradient-to-br from-blue-50/60 via-white to-sky-50/50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-8 sm:p-12 lg:p-16 shadow-lg shadow-blue-500/5">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 size-96 rounded-full bg-blue-400/15 dark:bg-blue-600/10 blur-[100px]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Concentric Glowing Rings Shield */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="relative flex items-center justify-center size-52 sm:size-60">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border border-blue-200/60 dark:border-blue-500/20 animate-[spin_24s_linear_infinite]" />
                {/* Middle Ring with dashed style */}
                <div className="absolute inset-5 rounded-full border-2 border-dashed border-blue-300/65 dark:border-blue-400/30 animate-[spin_18s_linear_infinite_reverse]" />
                {/* Inner Glow Circle */}
                <div className="absolute inset-10 rounded-full bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-950/80 dark:to-zinc-900 shadow-inner flex items-center justify-center" />
                {/* Center Shield Graphic */}
                <div className="relative size-20 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-xl shadow-blue-500/30 flex items-center justify-center">
                  <ShieldCheck className="size-10" />
                </div>
              </div>
            </div>

            {/* Right Column: Copy & Trust Pills */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <span className="font-funky text-sm sm:text-base font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
                  TRUST BY DESIGN
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Your team keeps the{" "}
                  <span className="text-blue-600 dark:text-blue-400">final say.</span>
                </h2>
              </div>

              <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                Orynd provides suggestions, not decisions. Your team reviews the context, applies their judgment, and decides what to merge.
              </p>

              {/* 3 Pills */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 shadow-xs">
                  <MessageSquare className="size-4 text-blue-600 dark:text-blue-400" />
                  <span>Suggestions, not autopilot</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 shadow-xs">
                  <Users className="size-4 text-blue-600 dark:text-blue-400" />
                  <span>Humans make the call</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 shadow-xs">
                  <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
                  <span>Your code, your standards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

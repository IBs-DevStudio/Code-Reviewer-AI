"use client";

import { useState } from "react";
import {
  Code2,
  Users,
  BarChart3,
  Sparkles,
  Check,
  Copy,
  CheckCircle2,
  Circle,
} from "lucide-react";

export function RolesSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText("if (user) { ... }");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="for-teams" className="py-24 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-16">
          <span className="font-funky text-sm sm:text-base font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
            FOR EVERY ROLE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Good reviews help{" "}
            <span className="text-blue-600 dark:text-blue-400">the whole team.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed">
            Different roles. A shared goal: higher quality code, faster.
          </p>
        </div>

        {/* 3 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Developers */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-50/40 dark:bg-zinc-950 p-6 sm:p-7 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700/50">
            <div className="space-y-4">
              <div className="size-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Code2 className="size-5" />
              </div>
              <div>
                <span className="font-funky text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  FOR DEVELOPERS
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white pt-1">
                  Get unstuck sooner
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 pt-1 leading-relaxed">
                  Catch issues early, learn as you go, and ship with confidence.
                </p>
              </div>
            </div>

            {/* Interactive Developer Mock */}
            <div className="mt-8 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 space-y-3 shadow-xs">
              {/* User question */}
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-300">
                <div className="rounded-full bg-slate-100 dark:bg-zinc-800 px-3 py-1 font-funky text-sm">
                  💭 &quot;Why is this failing?&quot;
                </div>
              </div>

              {/* AI suggestion */}
              <div className="rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  <Sparkles className="size-3.5 text-blue-600" />
                  <span>You&apos;re missing a null check here. Here&apos;s a suggested fix...</span>
                </div>
              </div>

              {/* Code snippet with copy */}
              <div className="rounded-md bg-slate-900 text-slate-100 p-2.5 font-mono text-xs flex items-center justify-between">
                <span>if (user) &#123; ... &#125;</span>
                <button
                  onClick={handleCopyCode}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Copy snippet"
                >
                  {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Reviewers */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-50/40 dark:bg-zinc-950 p-6 sm:p-7 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700/50">
            <div className="space-y-4">
              <div className="size-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="size-5" />
              </div>
              <div>
                <span className="font-funky text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  FOR REVIEWERS
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white pt-1">
                  Spend attention well
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 pt-1 leading-relaxed">
                  Offload the routine checks and focus on what really matters.
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="mt-8 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 space-y-2.5 text-xs text-slate-700 dark:text-zinc-200 shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Finds likely bugs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Highlights security risks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Suggests clearer code</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Checks edge cases</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                <Circle className="size-4 text-slate-400 shrink-0" />
                <span>Leaves architectural decisions to your team</span>
              </div>
            </div>
          </div>

          {/* Card 3: Engineering Leads */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-slate-50/40 dark:bg-zinc-950 p-6 sm:p-7 flex flex-col justify-between shadow-sm transition-all duration-300 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700/50">
            <div className="space-y-4">
              <div className="size-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <BarChart3 className="size-5" />
              </div>
              <div>
                <span className="font-funky text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  FOR ENGINEERING LEADS
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white pt-1">
                  Make quality repeatable
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 pt-1 leading-relaxed">
                  Set a higher bar across your codebase and help your team grow.
                </p>
              </div>
            </div>

            {/* Quality Progress Bars */}
            <div className="mt-8 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 space-y-3 shadow-xs">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Higher quality over time
              </div>

              <div className="space-y-2 text-[11px] text-slate-600 dark:text-zinc-300">
                <div>
                  <div className="flex justify-between pb-1">
                    <span>Fewer critical issues</span>
                    <span className="font-semibold text-blue-600">92%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600 w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between pb-1">
                    <span>More consistent reviews</span>
                    <span className="font-semibold text-blue-600">76%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 w-[76%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between pb-1">
                    <span>Shared knowledge</span>
                    <span className="font-semibold text-blue-600">86%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600 w-[86%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between pb-1">
                    <span>Faster onboarding</span>
                    <span className="font-semibold text-blue-600">68%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-sky-500 w-[68%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Bug,
  Check,
  CheckCircle2,
  FileCode2,
  FileText,
  GitBranch,
  GitPullRequest,
  MessageSquare,
  Sparkles,
  Users,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";

export function LandingHero() {
  const [viewMode, setViewMode] = useState<"solution" | "error">("error");
  return (
    <section className="hero pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Background atmospheric glows */}
      <div className="hero-glow -top-32 left-1/4 -translate-x-1/2 opacity-70" />
      <div className="pointer-events-none absolute top-40 -left-20 -z-10 size-[450px] rounded-full bg-sky-300/15 dark:bg-sky-500/10 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Eyebrow */}
            <div className="inline-block">
              <span className="font-funky text-sm sm:text-base font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
                ORYND — SHIP WITH CONVICTION
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Ship better code. <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">
                Without the review bottleneck.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              A thoughtful first pass for every pull request, so your team can focus on the decisions that matter.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95"
                >
                  See how it works
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#product"
                  className="inline-flex items-center rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-zinc-900 px-6 py-3 text-sm font-semibold text-slate-800 dark:text-white shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-95"
                >
                  Explore the product
                </a>
              </div>

              {/* Zero setup note - perfectly straight & aligned with buttons */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-funky tracking-wide text-blue-600 dark:text-blue-400">
                <Sparkles className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>Zero setup friction • Human engineers stay 100% in control</span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-slate-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <FaGithub className="size-4 text-slate-900 dark:text-white shrink-0" />
                <span>Designed for GitHub pull requests</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="size-4 text-slate-700 dark:text-zinc-300 shrink-0" />
                <span>Crafted by Ikram Banadar (IBs-DevStudio)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic / Interactive Before-and-After Switch */}
          <div className="lg:col-span-7 relative">
            {/* Background Atmosphere & Grid behind card (strictly -z-10) */}
            <div className="pointer-events-none absolute -inset-6 -z-10">
              <div className="hero-mock-grid" />
              <div className="hero-glow -top-10 -right-8 opacity-60" />
            </div>

            {/* Interactive Switch Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 relative z-20">
              <div className="inline-flex items-center p-1 rounded-full bg-slate-100/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-white/10 backdrop-blur-md shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("error")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer",
                    viewMode === "error"
                      ? "bg-rose-500 text-white shadow-sm shadow-rose-500/25 scale-[1.02]"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                  aria-pressed={viewMode === "error"}
                >
                  <AlertOctagon className="size-3.5" />
                  <span>The Problem (Without Orynd)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("solution")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer",
                    viewMode === "solution"
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25 scale-[1.02]"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                  aria-pressed={viewMode === "solution"}
                >
                  <Sparkles className="size-3.5" />
                  <span>The Solution (Orynd AI Review)</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs font-funky text-slate-500 dark:text-zinc-400">
                {viewMode === "error" ? (
                  <span className="text-rose-600 dark:text-rose-400 font-bold">⚠️ Production rendering crash</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Caught in PR before merge</span>
                )}
              </div>
            </div>

            {/* View 1: The Problem (How Errors Occur — Confused Team Illustration) */}
            {viewMode === "error" && (
              <div className="relative z-10 rounded-2xl border border-rose-200/90 dark:border-rose-900/40 bg-white dark:bg-zinc-950 shadow-2xl shadow-rose-500/5 overflow-hidden transition-all duration-300">
                {/* Browser / Error Incident Window Header */}
                <div className="border-b border-rose-200/80 dark:border-rose-900/40 bg-rose-50/70 dark:bg-zinc-900/90 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full bg-rose-500" />
                      <div className="size-2.5 rounded-full bg-amber-400" />
                      <div className="size-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-rose-700 dark:text-rose-300 pl-2">
                      ERROR: Display Rendering Failure
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-100/80 dark:bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-300/50 dark:border-rose-800/40">
                    <Bug className="size-3" />
                    <span>Unhandled Exception</span>
                  </div>
                </div>

                {/* Team Debugging Illustration with Interactive Overlay */}
                <div className="p-3 sm:p-4 bg-slate-50/40 dark:bg-zinc-900/30">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/error-display-failure.jpg"
                      alt="Engineering team bewildered by display rendering failure"
                      className="w-full h-auto max-h-[380px] object-cover object-center"
                    />

                    {/* Problem Callout Bar */}
                    <div className="p-3 sm:p-4 bg-white/95 dark:bg-zinc-900/95 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 font-sans">
                          <AlertTriangle className="size-4 text-rose-600 shrink-0" />
                          <span>How errors occur: Cryptic stack traces &amp; 4-hour review bottlenecks</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed font-sans">
                          Without automated first-pass reviews, silent null pointers and unhandled promises slip past manual review straight into production.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setViewMode("solution")}
                        className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all active:scale-95 cursor-pointer"
                      >
                        <Sparkles className="size-3.5" />
                        <span>Fix with Orynd AI</span>
                        <ArrowRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: The Solution (With Orynd AI Review in PR Window) */}
            {viewMode === "solution" && (
              <>
                {/* Top-Right Floating Pill with pointer arrow */}
                <div className="absolute -top-4 right-8 sm:right-16 z-20 hidden sm:flex items-center gap-1.5 rounded-full border border-blue-200/80 dark:border-blue-500/30 bg-white/95 dark:bg-zinc-900/95 px-3.5 py-1.5 text-xs sm:text-sm font-funky tracking-wide text-slate-800 dark:text-zinc-100 shadow-md backdrop-blur-md">
                  <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Context-aware feedback</span>
                </div>

                {/* Curved SVG pointer pointing to AI review card */}
                <svg
                  className="absolute 1 right-20 sm:right-28 z-10 w-16 h-12 text-blue-500 pointer-events-none hidden sm:block"
                  viewBox="0 0 60 50"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M48 2 C40 25, 20 28, 12 42"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="3 3"
                  />
                </svg>

                {/* GitHub Pull Request Window Mock (Clean white card on z-10) */}
                <div className="relative z-10 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-2xl shadow-blue-500/5 overflow-hidden transition-all duration-300">
                  {/* GitHub Header */}
                  <div className="border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-zinc-900/80 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-200">
                      <FaGithub className="size-4 text-slate-900 dark:text-white" />
                      <span className="text-slate-500 dark:text-zinc-400">IBs-DevStudio</span>
                      <span className="text-slate-400">/</span>
                      <span>Cogniva-Personalized.AI.Tutoring-Project</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[10px] font-bold text-blue-700 dark:text-blue-300 flex items-center justify-center">
                        IB
                      </div>
                    </div>
                  </div>

                  {/* GitHub Navigation Tabs */}
                  <div className="flex items-center gap-4 px-4 pt-2.5 border-b border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-zinc-400 overflow-x-auto">
                    <div className="flex items-center gap-1 pb-2 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                      <FileCode2 className="size-3.5" />
                      <span>Code</span>
                    </div>
                    <div className="flex items-center gap-1.5 pb-2 text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 cursor-pointer">
                      <GitPullRequest className="size-3.5" />
                      <span>Pull requests</span>
                      <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-1.5 py-0.2 text-[10px] font-medium text-blue-700 dark:text-blue-300">
                        12
                      </span>
                    </div>
                    <span className="pb-2 hover:text-slate-900 dark:hover:text-white cursor-pointer">Issues</span>
                    <span className="pb-2 hover:text-slate-900 dark:hover:text-white cursor-pointer">Actions</span>
                    <span className="pb-2 hover:text-slate-900 dark:hover:text-white cursor-pointer">Security</span>
                    <span className="pb-2 hover:text-slate-900 dark:hover:text-white cursor-pointer">Insights</span>
                  </div>

                  {/* PR Header & Sub-tabs */}
                  <div className="p-4 sm:p-5 space-y-3 bg-white dark:bg-zinc-950">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Add checkout retry handling
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 font-semibold">
                        <GitPullRequest className="size-3" />
                        Open
                      </span>
                      <span className="font-mono text-slate-600 dark:text-zinc-400">
                        feature/retry-checkout <span className="text-slate-400">→</span> main
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-white/5 pb-2 pt-1">
                      <span className="text-slate-900 dark:text-white font-semibold">Conversation 3</span>
                      <span>Commits 5</span>
                      <span>Checks 2</span>
                      <span>Files changed 3</span>
                    </div>

                    {/* Diff Container + Floating AI Review Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
                      {/* Diff Viewer */}
                      <div className="md:col-span-7 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/50 overflow-hidden text-[11px] font-mono leading-relaxed">
                        <div className="bg-slate-100 dark:bg-zinc-900 px-3 py-1.5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between text-slate-600 dark:text-zinc-300">
                          <span>src/payments/retry.ts</span>
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="text-emerald-600 font-semibold">+14</span>
                            <span className="text-slate-400">-0</span>
                          </div>
                        </div>
                        <div className="p-2 sm:p-3 overflow-x-auto text-slate-700 dark:text-zinc-300 space-y-0.5">
                          <div className="text-slate-400">18 18   try &#123;</div>
                          <div className="text-slate-500 dark:text-zinc-400">19 19     const result = await chargeCard(method, amount)</div>
                          <div className="text-slate-500 dark:text-zinc-400">20 20     return result</div>
                          <div className="text-slate-400">21 21   &#125; catch (error) &#123;</div>
                          <div className="bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-1 rounded-sm">
                            22 &nbsp;  +   if (isRetryableError(error)) &#123;
                          </div>
                          <div className="bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-1 rounded-sm">
                            23 &nbsp;  +     logger.info(&apos;Payment failed, retrying...&apos;)
                          </div>
                          <div className="bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-1 rounded-sm">
                            24 &nbsp;  +     await waitFor(1000)
                          </div>
                          <div className="bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-1 rounded-sm">
                            25 &nbsp;  +     return processPayment(amount, &#123; retry: true &#125;)
                          </div>
                          <div className="bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-1 rounded-sm">
                            26 &nbsp;  +   &#125;
                          </div>
                          <div className="text-slate-500 dark:text-zinc-400">27 26     throw error</div>
                          <div className="text-slate-400">28 27   &#125;</div>
                        </div>
                      </div>

                      {/* AI REVIEW Panel */}
                      <div className="md:col-span-5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-b from-blue-50/50 to-white dark:from-zinc-900 dark:to-zinc-950 p-3.5 space-y-3 shadow-md">
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                          <Sparkles className="size-3.5" />
                          <span>AI REVIEW</span>
                        </div>

                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            A thoughtful first pass.
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-0.5">
                            Clear, actionable feedback in seconds.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600 dark:text-zinc-300">
                          <span className="flex items-center gap-1 rounded bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5">
                            <FileText className="size-3 text-slate-500" />
                            3 files
                          </span>
                          <span className="flex items-center gap-1 rounded bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5">
                            <MessageSquare className="size-3 text-slate-500" />
                            1 note
                          </span>
                        </div>

                        <a
                          href="#product"
                          className="block w-full rounded-lg border border-blue-500/40 bg-white dark:bg-zinc-800 py-1.5 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors"
                        >
                          Preview review →
                        </a>

                        <div className="space-y-1.5 pt-1 text-[11px] text-slate-600 dark:text-zinc-300">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Checks for bugs and edge cases</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Suggests simpler, cleaner code</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Highlights security considerations</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Explains the why, not just what</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom-Right Floating Pill with pointer arrow */}
                <div className="absolute -bottom-4 right-10 sm:right-24 z-20 flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-white/95 dark:bg-zinc-900/95 px-3.5 py-1.5 text-xs sm:text-sm font-funky tracking-wide text-slate-800 dark:text-zinc-100 shadow-md backdrop-blur-md">
                  <span className="text-emerald-600 font-bold">📊</span>
                  <span>More signal, less noise.</span>
                </div>

                {/* Subtle curved pointer from bottom pill up towards the card */}
                <svg
                  className="absolute -bottom-2 right-4 sm:right-16 z-20 w-8 h-8 text-blue-500 pointer-events-none hidden sm:block"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M6 24 C16 22, 24 16, 22 4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="2.5 2.5"
                  />
                </svg>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

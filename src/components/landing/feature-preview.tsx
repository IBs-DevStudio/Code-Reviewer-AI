"use client";

import {
  FileText,
  Lightbulb,
  Users,
  Check,
  MoreHorizontal,
  Sparkles,
  GitPullRequest,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

export function FeaturePreview() {

  return (
    <section id="product" className="py-24 bg-slate-50/60 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pb-16">
          <span className="font-funky text-sm sm:text-base font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
            FEATURE PREVIEW
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            A review that{" "}
            <span className="text-blue-600 dark:text-blue-400">gets to the point.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed">
            Clear, actionable feedback, surfaced in your pull requests, with the context your team cares about.
          </p>
        </div>

        {/* Content: 2-Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: 3 Benefit Points */}
          <div className="lg:col-span-5 space-y-8">
            {/* Point 1 */}
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Feedback close to code
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  See inline comments and suggestions right in your pull request, where it&apos;s easiest to take action.
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <Lightbulb className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Reasons behind the notes
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Understand the why, with clear explanations and examples, not just what to change.
                </p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-xs">
                <Users className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Human choice, always
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  You decide what to accept. Orynd suggests, but your team stays in control.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: GitHub PR Window Mock with Inline Suggestion */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="border-b border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-zinc-900/90 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-200">
                  <FaGithub className="size-4 text-slate-900 dark:text-white" />
                  <span className="text-slate-500 dark:text-zinc-400">IBs-DevStudio</span>
                  <span className="text-slate-400">/</span>
                  <span>Cogniva-Personalized.AI.Tutoring-Project</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-xs font-semibold">
                    <GitPullRequest className="size-3" />
                    Open
                  </span>
                  <span className="text-xs font-mono text-slate-500">#482</span>
                  <MoreHorizontal className="size-4 text-slate-400 cursor-pointer" />
                </div>
              </div>

              {/* PR Title & Info */}
              <div className="p-4 sm:p-5 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Handle empty cart state
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="size-5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-[10px]">
                    IB
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">Ikram Banadar</span>
                  <span className="text-slate-500 dark:text-zinc-400">
                    opened this pull request 2 hours ago
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono pl-1">
                    <span className="text-emerald-600 font-semibold">+42</span>
                    <span className="text-rose-500 font-semibold">-6</span>
                  </div>
                </div>

                <div className="font-mono text-xs text-slate-500 dark:text-zinc-400">
                  <span className="rounded bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 text-slate-700 dark:text-zinc-300">
                    feature/empty-cart
                  </span>{" "}
                  →{" "}
                  <span className="rounded bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 text-slate-700 dark:text-zinc-300">
                    main
                  </span>
                </div>

                {/* Sub-tabs */}
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-zinc-400 border-b border-slate-200 dark:border-white/10 pb-2.5 pt-2">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    Conversation 3
                  </span>
                  <span>Commits 4</span>
                  <span>Checks 2</span>
                  <span>Files changed 5</span>
                </div>

                {/* File Diff Container */}
                <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-900/50 overflow-hidden text-xs">
                  <div className="bg-slate-100 dark:bg-zinc-900 px-3.5 py-2 border-b border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <FileText className="size-3.5 text-slate-500" />
                      <span className="font-medium text-slate-700 dark:text-zinc-300">
                        src/components/CartPage.tsx
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 font-semibold">+24</span>
                      <span className="text-rose-500 font-semibold">-6</span>
                      <MoreHorizontal className="size-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Code Diff lines */}
                  <div className="p-3 font-mono text-[11px] leading-relaxed text-slate-700 dark:text-zinc-300 space-y-0.5">
                    <div className="text-slate-400">42 &nbsp; return (</div>
                    <div className="text-slate-400">43 &nbsp; &nbsp; &lt;div className=&quot;container&quot;&gt;</div>

                    <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded">
                      44 &nbsp; - &nbsp; &nbsp; &#123;items.length === 0 &amp;&amp; &lt;EmptyCart /&gt;&#125;
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                      45 &nbsp; + &nbsp; &nbsp; &#123;items.length === 0 ? &lt;EmptyCart /&gt; : &lt;CartItems items=&#123;items&#125; /&gt;&#125;
                    </div>

                    <div className="text-slate-400">46 &nbsp; &nbsp; &lt;/div&gt;</div>
                    <div className="text-slate-400">47 &nbsp; )</div>
                  </div>

                  {/* Inline CodeReview AI Comment Card */}
                  <div className="m-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-zinc-950 p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <Sparkles className="size-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Orynd
                        </span>
                        <span className="text-[11px] text-slate-400">2 minutes ago</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-funky tracking-wide rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
                          Suggestion
                        </span>
                        <MoreHorizontal className="size-4 text-slate-400 cursor-pointer" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-sans">
                      Consider handling the empty state explicitly for better readability. Using a ternary makes the intent clearer and avoids rendering both branches. This also makes it easier to add tracking or a helpful message later on.
                    </p>
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

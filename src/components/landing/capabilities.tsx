"use client";

import { AlertTriangle, FileText, ShieldCheck, Sliders } from "lucide-react";

const CAPABILITIES = [
  {
    icon: FileText,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/40",
    title: "Context, not just syntax",
    description:
      "Understands your code, intent, and changes in context — not just pattern matching.",
  },
  {
    icon: ShieldCheck,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/40",
    title: "Feedback you can act on",
    description:
      "Clear, specific suggestions with examples, so you can ship higher quality code.",
  },
  {
    icon: Sliders,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800/40",
    title: "Your team's way of building",
    description:
      "Learns your stack, patterns, and preferences for relevant, consistent feedback.",
  },
  {
    icon: AlertTriangle,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/40",
    title: "A closer look at risk",
    description:
      "Flags potential bugs, security issues, edge cases, and performance concerns before they reach prod.",
  },
];

export function Capabilities() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div className="space-y-2">
            <span className="font-funky text-sm sm:text-base font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
              CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              More signal. Less review fatigue.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 max-w-md leading-relaxed">
            Go beyond surface-level comments. Orynd understands context, spots what matters, and helps your team move faster.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-zinc-950 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700/50 hover:-translate-y-1"
              >
                <div
                  className={`inline-flex rounded-xl border p-2.5 mb-4 ${cap.iconBg} ${cap.iconColor}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {cap.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

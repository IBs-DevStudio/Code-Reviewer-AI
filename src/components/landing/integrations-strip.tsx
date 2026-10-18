"use client";

import { FaGithub } from "react-icons/fa";
import { Layers, GitPullRequest, Users } from "lucide-react";

const ITEMS = [
  {
    icon: FaGithub,
    title: "GitHub workflow",
    desc: "Native to pull requests. No new tools to learn.",
  },
  {
    icon: Layers,
    title: "Any codebase",
    desc: "From startups to enterprises, across any language.",
  },
  {
    icon: GitPullRequest,
    title: "Pull request first",
    desc: "Reviews where your team already works.",
  },
  {
    icon: Users,
    title: "Human-led decisions",
    desc: "AI gives you a head start. You make the call.",
  },
];

export function IntegrationsStrip() {
  return (
    <section className="border-y border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-zinc-950 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Title */}
          <div className="md:col-span-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              Made for the tools and teams <br className="hidden sm:inline" />
              behind your code
            </h3>
          </div>

          {/* 4 Feature Items */}
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-2 text-slate-800 dark:text-zinc-200 shadow-xs">
                    <Icon className="size-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed pt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

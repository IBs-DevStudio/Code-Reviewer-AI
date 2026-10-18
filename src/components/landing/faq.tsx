"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    number: "1",
    question: "What does Orynd do?",
    answer:
      "Orynd analyzes your pull requests and provides clear, contextual feedback on code quality, potential bugs, security issues, and best practices — so your team can ship better code, faster.",
  },
  {
    number: "2",
    question: "Does it work with my existing GitHub workflow?",
    answer:
      "Yes! Orynd connects directly to GitHub. It reviews pull requests automatically as soon as they are opened or updated, leaving inline comments and suggestions right where your team already works.",
  },
  {
    number: "3",
    question: "Will AI approve or merge code for us?",
    answer:
      "No. Orynd is designed as a teammate that assists you, not an autopilot. Your human engineers always make the final decisions, approve PRs, and perform merges.",
  },
  {
    number: "4",
    question: "What kinds of feedback can it provide?",
    answer:
      "It detects logic bugs, race conditions, edge case mishandling, security vulnerabilities, performance bottlenecks, code style inconsistencies, and suggests concrete one-click fixes.",
  },
  {
    number: "5",
    question: "Can our team try it on a single repository first?",
    answer:
      "Absolutely. You can grant access to individual repositories or entire organizations, test it with a single repo, and expand whenever you're ready.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-3 pb-12">
          <span className="font-funky text-sm sm:text-base font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Before you open a <span className="text-blue-600 dark:text-blue-400">PR.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-500 dark:text-zinc-400">
            Quick answers to common questions about Orynd.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors hover:bg-slate-50/60 dark:hover:bg-zinc-900/60"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/80 text-sm font-funky text-blue-600 dark:text-blue-400">
                      {item.number}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`size-5 text-blue-600 dark:text-blue-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 pt-1 sm:px-6 sm:pb-6 text-sm sm:text-base text-slate-600 dark:text-zinc-300 pl-16 leading-relaxed border-t border-slate-100 dark:border-white/5">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { CodeReviewLogo } from "./logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
const NAV_ITEMS = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#for-teams", label: "For teams" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Creator Credit */}
        <div className="flex items-center gap-3">
            <Image
                  src="/orynd-logo.png"
                  alt="Orynd — ship with conviction"
                  width={160}
                  height={106}
                  priority
                  
                />
          <span className="hidden lg:inline-flex items-center gap-1 rounded-full border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/40 px-2.5 py-0.5 text-[11px] font-funky text-blue-700 dark:text-blue-300">
            by Ikram Banadar
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 dark:text-zinc-300 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          {session ? (
            <Link
              href="/repos"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95"
            >
              Dashboard
              <ArrowRight className="size-3.5" />
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-95"
            >
              Get started
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-black/95 px-5 py-4 space-y-3 backdrop-blur-xl">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-600"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-slate-200 dark:border-white/10">
            <Link
              href={session ? "/repos" : "/sign-in"}
              onClick={() => setMobileOpen(false)}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-blue-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              {session ? "Dashboard" : "Get started"}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

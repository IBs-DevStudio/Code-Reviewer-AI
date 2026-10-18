"use client";

import Link from "next/link";
import Image from "next/image";


export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200/90 dark:border-white/10 bg-white dark:bg-black py-16 text-slate-600 dark:text-zinc-400">
     
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100 dark:border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
              <Image
            
        src="/orynd-logo.png"
        alt="Orynd — ship with conviction"
        width={100}
        height={80}
        priority
        
    
      />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Orynd — Ship with conviction.
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 pt-1 leading-relaxed max-w-sm">
                Built by <span className="font-semibold text-slate-800 dark:text-zinc-200">Ikram Banadar</span> (IBs-DevStudio). AI pull request reviews designed for teams who take craft seriously.
              </p>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6">
            {/* Product */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                PRODUCT
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#product" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#for-teams" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                    For teams
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Learn */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                LEARN
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#product" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                    GitHub Guides
                  </a>
                </li>
                <li>
                  <a href="#for-teams" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                POLICIES
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-zinc-500">
          <p>© 2026 Orynd. All rights reserved.</p>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Crafted with conviction by</span>
            <span className="font-semibold text-slate-700 dark:text-zinc-200">Ikram Banadar</span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">&lt;/&gt;</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

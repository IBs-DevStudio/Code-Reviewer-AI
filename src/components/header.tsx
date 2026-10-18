"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, FolderGit2, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";

interface UserProps {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface HeaderProps {
  user: UserProps;
}

const navItems = [
  { href: "/repos", label: "Repositories", icon: FolderGit2 },
  { href: "/reviews", label: "Reviews", icon: FileCode2 },
];

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#cccccc] dark:border-white/15 bg-white/90 dark:bg-black backdrop-blur-xl shadow-xs transition-colors">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Simple Back Button to Home / Landing Page */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-white/15 bg-white dark:bg-zinc-900 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors shadow-2xs"
            title="Back to home"
            aria-label="Back to home"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Back</span>
          </Link>

        

          <div className="h-4 w-px bg-slate-200 dark:bg-white/15" />

          <nav className="flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                    isActive
                      ? "bg-blue-50 border-blue-200 text-blue-700 font-semibold shadow-xs dark:bg-white/10 dark:border-white/20 dark:text-white dark:shadow-none"
                      : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
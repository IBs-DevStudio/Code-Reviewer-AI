"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";

interface UserMenuProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email
    ? user.email[0].toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-9 gap-2 px-2 text-slate-800 hover:text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:text-white dark:hover:bg-white/10 transition-colors"
          />
        }
      >
        <Avatar className="size-7 ring-1 ring-border">
          <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
          <AvatarFallback className="text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-white dark:border dark:border-white/20">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden sm:inline-block text-sm font-medium max-w-[160px] truncate text-slate-800 dark:text-white">
          {user.name || user.email}
        </span>
        <ChevronDown className="size-3.5 text-slate-400 dark:text-white" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 border border-[#cccccc] dark:border-white/15 bg-white dark:bg-black text-slate-900 dark:text-white shadow-xl">
        <div className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
              <AvatarFallback className="bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-white dark:border dark:border-white/20 font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                {user.name || "User"}
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                {user.email}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-[#cccccc] dark:bg-white/15" />

        <DropdownMenuItem disabled className="gap-2 py-2 cursor-pointer dark:text-zinc-400">
          <User className="size-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem disabled className="gap-2 py-2 cursor-pointer dark:text-zinc-400">
          <Settings className="size-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[#cccccc] dark:bg-white/15" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="gap-2 py-2 cursor-pointer text-destructive focus:text-destructive dark:text-rose-400 dark:focus:text-rose-300 dark:focus:bg-rose-950/30"
        >
          <LogOut className="size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
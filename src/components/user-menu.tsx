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
    <Button variant="ghost" className="h-9 gap-2 px-2 hover:bg-muted/80" />
  }
>
  <Avatar className="size-7 ring-1 ring-border">
    <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
    <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
      {initials}
    </AvatarFallback>
  </Avatar>
  <span className="hidden sm:inline-block text-sm font-medium max-w-[100px] truncate">
    {user.name || user.email}
  </span>
  <ChevronDown className="size-3.5 text-muted-foreground" />
</DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {user.name || "User"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user.email}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled className="gap-2 py-2 cursor-pointer">
          <User className="size-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem disabled className="gap-2 py-2 cursor-pointer">
          <Settings className="size-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="gap-2 py-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
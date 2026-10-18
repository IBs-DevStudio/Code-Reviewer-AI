"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function HomeActions() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />;
  }

  if (!session) {
    return (
      <Button nativeButton={false} render={<Link href="/sign-in" />}>
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button nativeButton={false} render={<Link href="/repos" />}>
        Dashboard
      </Button>
      <Button
        variant="outline"
        onClick={async () => {
          await authClient.signOut();
          router.refresh();
        }}
      >
        Sign out
      </Button>
    </div>
  );
}
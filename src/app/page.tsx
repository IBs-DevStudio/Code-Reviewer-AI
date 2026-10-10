import { HealthCheck } from "@/components/health-check";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold">Code Review Platform</h1>
        <p className="text-muted-foreground">AI-powered GitHub pull request reviewer</p>
        <div className="flex items-center justify-center gap-4">
          <Button render={<Link href="/sign-in" />} nativeButton={false}>
  Sign In
</Button>
          <HealthCheck />
        </div>
      </div>
    </main>
  );
}
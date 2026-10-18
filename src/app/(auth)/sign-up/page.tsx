"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";
import { OryndGlyph } from "@/components/landing/logo";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signUp.email({
        name,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error.message ?? "An error occurred");
        setIsLoading(false);
      } else {
        router.push("/repos");
      }
    } catch {
      setError("An error occurred during registration");
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/repos",
      });
    } catch {
      setError("Failed to redirect to GitHub");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-grid-pattern bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">
      {/* Subtle blue ambient glow in background */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px]" />

      <Card className="w-full max-w-md border border-[#cccccc] dark:border-white/15 bg-white dark:bg-zinc-950 shadow-xl rounded-2xl">
        <CardHeader className="text-center pt-8 pb-4">
          <Link
            href="/"
            className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl border border-[#cccccc] dark:border-white/15 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs transition-transform hover:scale-105"
            aria-label="Orynd Home"
          >
            <OryndGlyph className="size-8" />
          </Link>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create your Orynd account
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-zinc-400">
            Ship with conviction. Enter your details below to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-8">
          <Button
            variant="outline"
            className="w-full h-10 border-[#cccccc] dark:border-white/15 bg-white dark:bg-black text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 font-medium"
            onClick={handleGithubSignIn}
            disabled={isLoading}
          >
            <FaGithub className="mr-2 h-4 w-4" />
            Sign up with GitHub
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-[#cccccc] dark:bg-white/15" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-950 px-2 text-slate-400 dark:text-zinc-400 font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 border-[#cccccc] dark:border-white/15 bg-white dark:bg-black text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:ring-blue-600"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-[#cccccc] dark:border-white/15 bg-white dark:bg-black text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:ring-blue-600"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 border-[#cccccc] dark:border-white/15 bg-white dark:bg-black text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus-visible:ring-blue-600"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-2.5 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 dark:text-zinc-400 pt-2">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
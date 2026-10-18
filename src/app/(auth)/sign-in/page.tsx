"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
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
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn.email({
      email,
      password,
    });

    if (result.error) {
      setError(result.error.message || "An error occurred");
      setLoading(false);
    } else {
      router.push("/repos");
    }
  };

  const handleGithubSignIn = async () => {
    setError("");
    setLoading(true);

    await signIn.social({
      provider: "github",
      callbackURL: "/repos",
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-grid-pattern bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">
      {/* Subtle blue ambient glow in background */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px]" />

      <Card className="w-full max-w-md border border-[#cccccc] dark:border-white/15 bg-white dark:bg-zinc-950 shadow-xl rounded-2xl">
        <CardHeader className="text-center pt-8 pb-4">
          <Link
            href="/"
            className="mx-auto mb-3 flex items-center justify-center "
            aria-label="Orynd Home"
          >
             <Image
                          src="/brand-4.png"
                          alt="Orynd — ship with conviction"
                          width={140}
                          height={106}
                          priority
                          
                        />
          </Link>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome to Orynd
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-zinc-400">
            Ship with conviction. Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-8">
          <Button
            variant="outline"
            className="w-full h-10 border-[#cccccc] dark:border-white/15 bg-white dark:bg-black text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10 font-medium"
            onClick={handleGithubSignIn}
            disabled={loading}
          >
            <FaGithub className="mr-2 h-4 w-4" />
            Sign in with GitHub
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

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
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
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 dark:text-zinc-400 pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
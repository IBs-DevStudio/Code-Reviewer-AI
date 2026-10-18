import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="relative min-h-screen bg-dot-grid bg-white dark:bg-black text-slate-900 dark:text-white transition-colors">
      {/* Subtle top ambient blue spotlight */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[600px] -translate-x-1/2 rounded-full bg-blue-500/8 dark:bg-blue-600/15 blur-[120px]" />
      <Header user={session.user} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
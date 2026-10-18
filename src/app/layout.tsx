import type { Metadata } from "next";
import { Geist, Geist_Mono, Patrick_Hand_SC, Caveat } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc";
import { ThemeProvider } from "@/components/theme-provider";

import { Toaster } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const patrickHandSC = Patrick_Hand_SC({
  weight: "400",
  variable: "--font-funky",
  subsets: ["latin"],
});

const caveat = Caveat({
  weight: ["500", "700"],
  variable: "--font-handwriting",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orynd — Ship with conviction | AI Code Reviewer by Ikram Banadar",
  description: "A thoughtful first pass for every pull request, built with conviction by Ikram Banadar (IBs-DevStudio).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${patrickHandSC.variable} ${caveat.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TRPCProvider>
            {children}
            <Toaster />
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  href?: string;
}

export function OryndLogo({
  className,
  size = "md",
  href = "/",
}: LogoProps) {
  const heightClass = {
    sm: "h-7",
    md: "h-9",
    lg: "h-11",
  }[size];

  const content = (
    <div className={cn("group inline-flex items-center select-none", className)}>
      <Image
        src="/orynd-logo.png"
        alt="Orynd — ship with conviction"
        width={160}
        height={106}
        priority
        className={cn(
          "w-auto object-contain transition-transform duration-200 group-hover:scale-105",
          heightClass
        )}
      />
    </div>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
      aria-label="Orynd - Home"
    >
      {content}
    </Link>
  );
}

export function OryndGlyph({
  className = "size-7",
}: {
  className?: string;
}) {
  return (
    <Image
      src="/orynd-logo.png"
      alt="Orynd"
      width={48}
      height={32}
      className={cn("w-auto h-7 object-contain", className)}
    />
  );
}

// Aliases for compatibility
export const CodeReviewLogo = OryndLogo;
export const CodeReviewGlyph = OryndGlyph;

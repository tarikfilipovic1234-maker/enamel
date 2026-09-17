import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "bg-teal-700 text-white hover:bg-teal-800",
  outline: "border border-ink/15 bg-white text-ink hover:border-ink/30 hover:bg-mist",
  ghost: "text-teal-800 hover:bg-teal-700/8",
};

const sizes: Record<Size, string> = {
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

function classes(variant: Variant, size: Size, className?: string) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`;
}

type LinkButtonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
} & ComponentProps<typeof Link>;

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={classes(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
} & ComponentProps<"button">;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

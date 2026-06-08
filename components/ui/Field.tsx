import type { ComponentProps, ReactNode } from "react";

const fieldClass =
  "w-full rounded-2xl border border-teal-900/10 bg-white/70 px-4 py-3 text-ink shadow-sm outline-none transition-all placeholder:text-ink/30 focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/30";

export function Label({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink/70">
      {children}
    </label>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={`${fieldClass} ${props.className ?? ""}`} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return (
    <textarea {...props} className={`${fieldClass} resize-none ${props.className ?? ""}`} />
  );
}

export function Select(props: ComponentProps<"select">) {
  return (
    <select {...props} className={`${fieldClass} appearance-none ${props.className ?? ""}`} />
  );
}

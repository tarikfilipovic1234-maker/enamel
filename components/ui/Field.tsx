import type { ComponentProps, ReactNode } from "react";

const fieldClass =
  "w-full rounded-md border border-ink/20 bg-white px-3.5 py-2.5 text-ink transition-colors placeholder:text-ink/35 hover:border-ink/30 focus:border-teal-700";

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

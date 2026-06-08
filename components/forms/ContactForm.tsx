"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { submitContact } from "@/app/actions/contact";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Field";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

export function ContactForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [state, action, pending] = useActionState(submitContact, undefined);

  if (state?.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass flex flex-col items-center rounded-[var(--radius-card)] p-10 text-center"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-gradient text-white">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 4 4L19 6" />
          </svg>
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{dict.contact.successTitle}</h3>
        <p className="mt-2 text-ink/60">{dict.contact.successText}</p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="glass rounded-[var(--radius-card)] p-7 sm:p-8">
      <input type="hidden" name="locale" value={lang} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">{dict.contact.name}</Label>
          <Input id="name" name="name" required minLength={2} autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="email">{dict.contact.email}</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">{dict.contact.phone}</Label>
          <Input id="phone" name="phone" autoComplete="tel" />
        </div>
        <div>
          <Label htmlFor="subject">{dict.contact.subject}</Label>
          <Input id="subject" name="subject" required minLength={2} />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="message">{dict.contact.message}</Label>
        <Textarea id="message" name="message" rows={5} required minLength={5} />
      </div>

      {state && !state.ok && (
        <p className="mt-3 text-sm text-accent-600">{dict.contact.errorGeneric}</p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="mt-6 w-full">
        {pending ? dict.contact.submitting : dict.contact.submit}
      </Button>
    </form>
  );
}

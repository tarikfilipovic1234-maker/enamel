"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { submitTestimonial } from "@/app/actions/testimonial";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Field";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

export function TestimonialForm({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const [state, action, pending] = useActionState(submitTestimonial, undefined);
  const [rating, setRating] = useState(5);

  if (state?.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-[var(--radius-card)] p-8 text-center"
      >
        <h3 className="font-display text-xl font-semibold text-ink">{dict.testimonials.formSuccessTitle}</h3>
        <p className="mt-2 text-ink/60">{dict.testimonials.formSuccessText}</p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="glass rounded-[var(--radius-card)] p-7">
      <input type="hidden" name="locale" value={lang} />
      <input type="hidden" name="rating" value={rating} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="patientName">{dict.testimonials.formName}</Label>
          <Input id="patientName" name="patientName" required minLength={2} />
        </div>
        <div>
          <Label htmlFor="service">{dict.testimonials.formService}</Label>
          <Input id="service" name="service" />
        </div>
      </div>

      <div className="mt-4">
        <Label>{dict.testimonials.formRating}</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n}`}
              className={`text-2xl transition-colors ${n <= rating ? "text-accent-500" : "text-ink/20"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="text">{dict.testimonials.formText}</Label>
        <Textarea id="text" name="text" rows={4} required minLength={5} />
      </div>

      {state && !state.ok && (
        <p className="mt-3 text-sm text-accent-600">{dict.testimonials.formError}</p>
      )}

      <Button type="submit" disabled={pending} className="mt-6 w-full">
        {pending ? dict.testimonials.formSubmitting : dict.testimonials.formSubmit}
      </Button>
    </form>
  );
}

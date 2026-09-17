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
        className="surface rounded-[var(--radius-card)] p-8 text-center"
      >
        <h3 className="font-display text-xl font-semibold text-ink">{dict.testimonials.formSuccessTitle}</h3>
        <p className="mt-2 text-ink/60">{dict.testimonials.formSuccessText}</p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="surface rounded-[var(--radius-card)] p-7">
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

      <fieldset className="mt-4">
        <legend className="mb-1.5 block text-sm font-medium text-ink/70">
          {dict.testimonials.formRating}
        </legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-pressed={n === rating}
              aria-label={`${n} / 5`}
              className={`rounded-sm p-0.5 transition-colors ${
                n <= rating ? "text-amber-500" : "text-ink/25 hover:text-ink/40"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill={n <= rating ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 17l-5.4 2.6 1.2-6L3.3 9.4l6.1-.8L12 3Z" />
              </svg>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <Label htmlFor="text">{dict.testimonials.formText}</Label>
        <Textarea id="text" name="text" rows={4} required minLength={5} />
      </div>

      {state && !state.ok && (
        <p className="mt-3 text-sm text-red-700">{dict.testimonials.formError}</p>
      )}

      <Button type="submit" disabled={pending} className="mt-6 w-full">
        {pending ? dict.testimonials.formSubmitting : dict.testimonials.formSubmit}
      </Button>
    </form>
  );
}

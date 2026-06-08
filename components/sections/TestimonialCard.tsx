import { t, type Locale } from "@/lib/i18n";

type TestimonialLike = {
  patientName: string;
  rating: number;
  text: unknown;
  service: string | null;
};

export function TestimonialCard({
  testimonial,
  lang,
}: {
  testimonial: TestimonialLike;
  lang: Locale;
}) {
  return (
    <figure className="glass flex h-full flex-col rounded-[var(--radius-card)] p-7">
      <div className="flex gap-0.5 text-accent-500" aria-label={`${testimonial.rating}/5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill={i < testimonial.rating ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6L12 17l-5.4 2.6 1.2-6L3.3 9.4l6.1-.8L12 3Z" />
          </svg>
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-ink/75">
        “{t(testimonial.text, lang)}”
      </blockquote>
      <figcaption className="mt-5 border-t border-teal-900/10 pt-4">
        <span className="font-semibold text-ink">{testimonial.patientName}</span>
        {testimonial.service && (
          <span className="block text-sm text-ink/50">{testimonial.service}</span>
        )}
      </figcaption>
    </figure>
  );
}

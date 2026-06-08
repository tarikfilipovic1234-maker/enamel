import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { getApprovedTestimonials } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { TestimonialCard } from "@/components/sections/TestimonialCard";

export async function generateMetadata({ params }: PageProps<"/[lang]/testimonials">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return { title: dict.testimonials.title, description: dict.testimonials.subtitle };
}

export default async function TestimonialsPage({ params }: PageProps<"/[lang]/testimonials">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const testimonials = await getApprovedTestimonials();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <SectionHeading eyebrow={dict.nav.testimonials} title={dict.testimonials.title} subtitle={dict.testimonials.subtitle} />

      {testimonials.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((tm, i) => (
            <Reveal key={tm.id} delay={(i % 3) * 0.07}>
              <TestimonialCard testimonial={tm} lang={lang as Locale} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-ink/50">{dict.testimonials.empty}</p>
      )}
    </div>
  );
}

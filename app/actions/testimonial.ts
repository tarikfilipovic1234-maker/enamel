"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { FormState } from "@/lib/validators";

const schema = z.object({
  patientName: z.string().trim().min(2),
  text: z.string().trim().min(5),
  rating: z.coerce.number().min(1).max(5),
  service: z.string().trim().optional().or(z.literal("")),
  locale: z.string().default("bs"),
});

export async function submitTestimonial(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = schema.safeParse({
    patientName: formData.get("patientName"),
    text: formData.get("text"),
    rating: formData.get("rating"),
    service: formData.get("service"),
    locale: formData.get("locale"),
  });
  if (!parsed.success) return { ok: false, error: "invalid" };

  const { patientName, text, rating, service, locale } = parsed.data;
  try {
    await prisma.testimonial.create({
      data: {
        patientName,
        rating,
        // Author writes in their current locale; store under that key.
        text: { [locale]: text },
        service: service || null,
        status: "PENDING",
      },
    });
  } catch (e) {
    console.error("submitTestimonial:", e);
    return { ok: false, error: "server" };
  }
  return { ok: true };
}

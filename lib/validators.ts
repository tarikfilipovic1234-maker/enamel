import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  phone: z.string().trim().optional().or(z.literal("")),
  subject: z.string().trim().min(2),
  message: z.string().trim().min(5),
  locale: z.string().default("bs"),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const appointmentSchema = z.object({
  serviceId: z.string().min(1),
  staffId: z.string().optional().or(z.literal("")),
  patientName: z.string().trim().min(2),
  patientEmail: z.email(),
  patientPhone: z.string().trim().min(6),
  // ISO datetime string for the selected slot start.
  start: z.string().datetime({ offset: true }).or(z.string().min(10)),
  notes: z.string().trim().optional().or(z.literal("")),
  locale: z.string().default("bs"),
});
export type AppointmentInput = z.infer<typeof appointmentSchema>;

/** Shared shape returned by form Server Actions for useActionState. */
export type FormState =
  | { ok: true }
  | { ok: false; error: string }
  | undefined;

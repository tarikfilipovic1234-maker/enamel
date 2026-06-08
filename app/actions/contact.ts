"use server";

import { prisma } from "@/lib/prisma";
import { sendContactEmails } from "@/lib/email";
import { contactSchema, type FormState } from "@/lib/validators";

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }

  const data = parsed.data;

  try {
    await prisma.contactInquiry.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
        locale: data.locale,
      },
    });
  } catch (e) {
    console.error("submitContact:", e);
    return { ok: false, error: "server" };
  }

  await sendContactEmails({
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    subject: data.subject,
    message: data.message,
  });

  return { ok: true };
}

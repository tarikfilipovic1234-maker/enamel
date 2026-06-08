"use server";

import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/availability";
import { sendAppointmentEmails } from "@/lib/email";
import { appointmentSchema, type FormState } from "@/lib/validators";
import { formatDateTime } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

/** Called from the booking client to refresh slots when inputs change. */
export async function fetchSlots(
  serviceId: string,
  staffId: string | null,
  date: string,
): Promise<string[]> {
  if (!serviceId || !date) return [];
  return getAvailableSlots({ serviceId, staffId: staffId || null, date });
}

export async function createAppointment(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = appointmentSchema.safeParse({
    serviceId: formData.get("serviceId"),
    staffId: formData.get("staffId"),
    patientName: formData.get("patientName"),
    patientEmail: formData.get("patientEmail"),
    patientPhone: formData.get("patientPhone"),
    start: formData.get("start"),
    notes: formData.get("notes"),
    locale: formData.get("locale"),
  });

  if (!parsed.success) return { ok: false, error: "invalid" };
  const data = parsed.data;

  const start = new Date(data.start);
  if (Number.isNaN(start.getTime()) || start.getTime() < Date.now()) {
    return { ok: false, error: "invalid" };
  }
  const staffId = data.staffId || null;

  let serviceName = "";
  try {
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service) return { ok: false, error: "invalid" };
    const end = new Date(start.getTime() + service.durationMin * 60_000);
    serviceName =
      (service.name as Record<string, string>)?.[data.locale] ??
      (service.name as Record<string, string>)?.bs ??
      "";

    await prisma.$transaction(async (tx) => {
      // Hard overlap guard when a specific dentist is requested.
      if (staffId) {
        const clash = await tx.appointment.findFirst({
          where: {
            staffId,
            status: "APPROVED",
            start: { lt: end },
            end: { gt: start },
          },
          select: { id: true },
        });
        if (clash) throw new Error("SLOT_TAKEN");
      }

      await tx.appointment.create({
        data: {
          serviceId: data.serviceId,
          staffId,
          patientName: data.patientName,
          patientEmail: data.patientEmail,
          patientPhone: data.patientPhone,
          start,
          end,
          durationMin: service.durationMin,
          notes: data.notes || null,
          locale: data.locale,
          status: "PENDING",
        },
      });
    });
  } catch (e) {
    if (e instanceof Error && e.message === "SLOT_TAKEN") {
      return { ok: false, error: "slot" };
    }
    console.error("createAppointment:", e);
    return { ok: false, error: "server" };
  }

  await sendAppointmentEmails({
    patientName: data.patientName,
    patientEmail: data.patientEmail,
    serviceName,
    whenLabel: formatDateTime(start, data.locale as Locale),
  });

  return { ok: true };
}

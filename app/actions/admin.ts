"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AppointmentStatus, InquiryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { sendAppointmentStatusEmail } from "@/lib/email";
import { formatDateTime } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

const localized = (bs: FormDataEntryValue | null, en: FormDataEntryValue | null) => ({
  bs: String(bs ?? ""),
  en: String(en ?? bs ?? ""),
});

/* --------------------------------- Appointments -------------------------- */
export async function updateAppointmentStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as AppointmentStatus;
  const newStartRaw = formData.get("start");

  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: { service: true },
  });
  if (!appt) return;

  let start = appt.start;
  let end = appt.end;
  if (newStartRaw) {
    start = new Date(String(newStartRaw));
    end = new Date(start.getTime() + appt.durationMin * 60_000);
  }

  // Overlap guard when confirming a specific dentist.
  if (
    (status === AppointmentStatus.APPROVED || status === AppointmentStatus.RESCHEDULED) &&
    appt.staffId
  ) {
    const clash = await prisma.appointment.findFirst({
      where: {
        id: { not: id },
        staffId: appt.staffId,
        status: AppointmentStatus.APPROVED,
        start: { lt: end },
        end: { gt: start },
      },
      select: { id: true },
    });
    if (clash) return; // silently ignore conflicting confirmation
  }

  await prisma.appointment.update({
    where: { id },
    data: { status, start, end },
  });

  if (status !== AppointmentStatus.PENDING && status !== AppointmentStatus.CANCELLED) {
    const name =
      (appt.service.name as Record<string, string>)?.[appt.locale] ??
      (appt.service.name as Record<string, string>)?.bs ??
      "";
    await sendAppointmentStatusEmail({
      patientName: appt.patientName,
      patientEmail: appt.patientEmail,
      serviceName: name,
      whenLabel: formatDateTime(start, appt.locale as Locale),
      status: status as "APPROVED" | "REJECTED" | "RESCHEDULED",
    });
  }

  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
}

/* ----------------------------------- Inquiries --------------------------- */
export async function updateInquiryStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as InquiryStatus;
  await prisma.contactInquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin/inquiries");
}

/* ----------------------------------- Services ---------------------------- */
export async function upsertService(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const priceRaw = formData.get("priceFrom");

  const data = {
    slug: String(formData.get("slug")).trim(),
    name: localized(formData.get("nameBs"), formData.get("nameEn")),
    description: localized(formData.get("descBs"), formData.get("descEn")),
    durationMin: Number(formData.get("durationMin")) || 30,
    priceFrom: priceRaw ? Number(priceRaw) : null,
    category: String(formData.get("category") ?? "") || null,
    order: Number(formData.get("order")) || 0,
    isActive: formData.get("isActive") === "on",
  };

  if (id) {
    await prisma.service.update({ where: { id }, data });
  } else {
    await prisma.service.create({ data });
  }
  revalidatePath("/admin/services");
  revalidatePath("/[lang]/services", "page");
  redirect("/admin/services");
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  try {
    await prisma.service.delete({ where: { id } });
  } catch {
    // Has appointments referencing it — deactivate instead of hard-delete.
    await prisma.service.update({ where: { id }, data: { isActive: false } });
  }
  revalidatePath("/admin/services");
}

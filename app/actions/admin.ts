"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AppointmentStatus, InquiryStatus, PostStatus, TestimonialStatus } from "@prisma/client";
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

const csv = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/* ------------------------------------- Staff ----------------------------- */
export async function upsertStaff(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const data = {
    slug: String(formData.get("slug")).trim(),
    name: String(formData.get("name")).trim(),
    title: localized(formData.get("titleBs"), formData.get("titleEn")),
    bio: localized(formData.get("bioBs"), formData.get("bioEn")),
    photoUrl: String(formData.get("photoUrl") ?? "") || null,
    specialties: csv(formData.get("specialties")),
    order: Number(formData.get("order")) || 0,
    isActive: formData.get("isActive") === "on",
  };
  if (id) await prisma.staffMember.update({ where: { id }, data });
  else await prisma.staffMember.create({ data });
  revalidatePath("/admin/team");
  revalidatePath("/[lang]/team", "page");
  redirect("/admin/team");
}

export async function deleteStaff(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  try {
    await prisma.staffMember.delete({ where: { id } });
  } catch {
    await prisma.staffMember.update({ where: { id }, data: { isActive: false } });
  }
  revalidatePath("/admin/team");
}

/* Working hours: one row per weekday (0–6); blank start/end clears the day. */
export async function saveWorkingHours(formData: FormData) {
  await requireAdmin();
  const staffId = String(formData.get("staffId"));
  for (let day = 0; day < 7; day++) {
    const start = formData.get(`start_${day}`);
    const end = formData.get(`end_${day}`);
    const startMin = start ? Number(start) : null;
    const endMin = end ? Number(end) : null;
    if (startMin != null && endMin != null && endMin > startMin) {
      await prisma.workingHours.upsert({
        where: { staffId_dayOfWeek: { staffId, dayOfWeek: day } },
        update: { startMin, endMin },
        create: { staffId, dayOfWeek: day, startMin, endMin },
      });
    } else {
      await prisma.workingHours
        .delete({ where: { staffId_dayOfWeek: { staffId, dayOfWeek: day } } })
        .catch(() => {});
    }
  }
  revalidatePath(`/admin/team/${staffId}`);
}

export async function addTimeOff(formData: FormData) {
  await requireAdmin();
  const staffId = String(formData.get("staffId"));
  const start = new Date(String(formData.get("start")));
  const end = new Date(String(formData.get("end")));
  if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end > start) {
    await prisma.timeOff.create({
      data: { staffId, start, end, reason: String(formData.get("reason") ?? "") || null },
    });
  }
  revalidatePath(`/admin/team/${staffId}`);
}

export async function deleteTimeOff(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const staffId = String(formData.get("staffId"));
  await prisma.timeOff.delete({ where: { id } }).catch(() => {});
  revalidatePath(`/admin/team/${staffId}`);
}

/* --------------------------------- Testimonials -------------------------- */
export async function moderateTestimonial(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as TestimonialStatus;
  await prisma.testimonial.update({ where: { id }, data: { status } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/[lang]/testimonials", "page");
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.testimonial.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/testimonials");
}

/* ------------------------------------- Blog ------------------------------ */
export async function upsertPost(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const status = String(formData.get("status")) as PostStatus;

  const existing = id
    ? await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } })
    : null;

  const data = {
    slug: String(formData.get("slug")).trim(),
    title: localized(formData.get("titleBs"), formData.get("titleEn")),
    excerpt: localized(formData.get("excerptBs"), formData.get("excerptEn")),
    body: localized(formData.get("bodyBs"), formData.get("bodyEn")),
    coverImage: String(formData.get("coverImage") ?? "") || null,
    tags: csv(formData.get("tags")),
    authorId: String(formData.get("authorId") ?? "") || null,
    status,
    publishedAt:
      status === PostStatus.PUBLISHED
        ? (existing?.publishedAt ?? new Date())
        : null,
  };
  if (id) await prisma.blogPost.update({ where: { id }, data });
  else await prisma.blogPost.create({ data });
  revalidatePath("/admin/blog");
  revalidatePath("/[lang]/blog", "page");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.blogPost.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/blog");
}

import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? "Enamel <onboarding@resend.dev>";
const clinicInbox = process.env.CONTACT_TO_EMAIL ?? "info@enamel.ba";

const resend = apiKey ? new Resend(apiKey) : null;

type Mail = { to: string; subject: string; html: string };

/** Send mail if Resend is configured; otherwise log (no-op) so dev works. */
async function send({ to, subject, html }: Mail) {
  if (!resend) {
    console.info(`[email skipped — no RESEND_API_KEY] → ${to}: ${subject}`);
    return;
  }
  try {
    await resend.emails.send({ from, to, subject, html });
  } catch (e) {
    console.error("Resend send failed:", e);
  }
}

const shell = (title: string, body: string) => `
  <div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;padding:24px;color:#0a2c46">
    <h2 style="color:#0d9488;margin:0 0 16px">${title}</h2>
    ${body}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
    <p style="font-size:12px;color:#94a3b8">Enamel — Stomatološka poliklinika, Sarajevo</p>
  </div>`;

const esc = (s: string) =>
  s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] as string);

export async function sendContactEmails(input: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  // To clinic
  await send({
    to: clinicInbox,
    subject: `Novi upit: ${input.subject}`,
    html: shell(
      "Novi kontakt upit",
      `<p><strong>${esc(input.name)}</strong> (${esc(input.email)}${input.phone ? `, ${esc(input.phone)}` : ""})</p>
       <p><strong>Naslov:</strong> ${esc(input.subject)}</p>
       <p style="white-space:pre-wrap">${esc(input.message)}</p>`,
    ),
  });
  // Acknowledge sender
  await send({
    to: input.email,
    subject: "Hvala na vašoj poruci — Enamel",
    html: shell(
      "Primili smo vašu poruku",
      `<p>Poštovani/a ${esc(input.name)},</p>
       <p>Hvala što ste nas kontaktirali. Odgovorit ćemo u najkraćem mogućem roku.</p>`,
    ),
  });
}

export async function sendAppointmentEmails(input: {
  patientName: string;
  patientEmail: string;
  serviceName: string;
  whenLabel: string;
}) {
  await send({
    to: clinicInbox,
    subject: `Novi zahtjev za termin — ${input.serviceName}`,
    html: shell(
      "Novi zahtjev za termin",
      `<p><strong>${esc(input.patientName)}</strong> (${esc(input.patientEmail)})</p>
       <p><strong>Usluga:</strong> ${esc(input.serviceName)}</p>
       <p><strong>Termin:</strong> ${esc(input.whenLabel)}</p>`,
    ),
  });
  await send({
    to: input.patientEmail,
    subject: "Zahtjev za termin zaprimljen — Enamel",
    html: shell(
      "Zahtjev zaprimljen",
      `<p>Poštovani/a ${esc(input.patientName)},</p>
       <p>Vaš zahtjev za termin (<strong>${esc(input.serviceName)}</strong>, ${esc(input.whenLabel)}) je zaprimljen. Kontaktirat ćemo vas radi potvrde.</p>`,
    ),
  });
}

export async function sendAppointmentStatusEmail(input: {
  patientName: string;
  patientEmail: string;
  serviceName: string;
  whenLabel: string;
  status: "APPROVED" | "REJECTED" | "RESCHEDULED";
}) {
  const titles = {
    APPROVED: "Vaš termin je potvrđen",
    REJECTED: "Vaš zahtjev za termin",
    RESCHEDULED: "Vaš termin je pomjeren",
  } as const;
  const bodies = {
    APPROVED: `<p>Radujemo se vašem dolasku.</p>`,
    REJECTED: `<p>Nažalost, traženi termin nije moguć. Molimo zakažite novi termin.</p>`,
    RESCHEDULED: `<p>Vaš termin je pomjeren na novi datum naveden iznad.</p>`,
  } as const;
  await send({
    to: input.patientEmail,
    subject: `${titles[input.status]} — Enamel`,
    html: shell(
      titles[input.status],
      `<p>Poštovani/a ${esc(input.patientName)},</p>
       <p><strong>Usluga:</strong> ${esc(input.serviceName)}</p>
       <p><strong>Termin:</strong> ${esc(input.whenLabel)}</p>
       ${bodies[input.status]}`,
    ),
  });
}

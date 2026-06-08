import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";

async function loadStats() {
  try {
    const [pending, totalAppts, newInquiries, activeServices, recent] =
      await Promise.all([
        prisma.appointment.count({ where: { status: "PENDING" } }),
        prisma.appointment.count(),
        prisma.contactInquiry.count({ where: { status: "NEW" } }),
        prisma.service.count({ where: { isActive: true } }),
        prisma.appointment.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          include: { service: true },
        }),
      ]);
    return { pending, totalAppts, newInquiries, activeServices, recent };
  } catch (e) {
    console.error("admin loadStats:", e);
    return { pending: 0, totalAppts: 0, newInquiries: 0, activeServices: 0, recent: [] };
  }
}

export default async function AdminDashboard() {
  const s = await loadStats();
  const cards = [
    { label: "Pending requests", value: s.pending, href: "/admin/appointments", accent: "text-accent-600" },
    { label: "Total appointments", value: s.totalAppts, href: "/admin/appointments", accent: "text-teal-700" },
    { label: "New inquiries", value: s.newInquiries, href: "/admin/inquiries", accent: "text-sardinia-600" },
    { label: "Active services", value: s.activeServices, href: "/admin/services", accent: "text-slate-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`text-3xl font-semibold ${c.accent}`}>{c.value}</div>
            <div className="mt-1 text-sm text-slate-500">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Recent requests</h2>
        {s.recent.length > 0 ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {s.recent.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <span className="font-medium">{a.patientName}</span>
                  <span className="text-slate-400">
                    {" "}· {(a.service.name as Record<string, string>)?.bs ?? ""}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span>{formatDateTime(a.start, "bs")}</span>
                  <StatusPill status={a.status} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-slate-400">No requests yet.</p>
        )}
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-teal-100 text-teal-700",
    REJECTED: "bg-rose-100 text-rose-700",
    RESCHEDULED: "bg-sky-100 text-sky-700",
    CANCELLED: "bg-slate-200 text-slate-500",
    NEW: "bg-amber-100 text-amber-700",
    READ: "bg-slate-200 text-slate-600",
    RESPONDED: "bg-teal-100 text-teal-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? "bg-slate-100"}`}>
      {status}
    </span>
  );
}

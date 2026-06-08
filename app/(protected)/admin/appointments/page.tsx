import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { updateAppointmentStatus } from "@/app/actions/admin";
import { StatusPill } from "../page";

async function loadAppointments() {
  try {
    return await prisma.appointment.findMany({
      orderBy: [{ status: "asc" }, { start: "asc" }],
      include: { service: true, staff: true },
    });
  } catch (e) {
    console.error("loadAppointments:", e);
    return [];
  }
}

export default async function AdminAppointments() {
  const appointments = await loadAppointments();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>

      {appointments.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-slate-400 shadow-sm">
          No appointment requests yet.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {appointments.map((a) => (
            <div key={a.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{a.patientName}</span>
                    <StatusPill status={a.status} />
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {(a.service.name as Record<string, string>)?.bs ?? ""}
                    {a.staff ? ` · ${a.staff.name}` : " · (no preference)"}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {formatDateTime(a.start, "bs")} · {a.durationMin} min
                  </div>
                  <div className="mt-1 text-sm text-slate-400">
                    {a.patientEmail} · {a.patientPhone}
                  </div>
                  {a.notes && <p className="mt-2 text-sm text-slate-600">“{a.notes}”</p>}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {a.status === "PENDING" && (
                    <div className="flex gap-2">
                      <form action={updateAppointmentStatus}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="status" value="APPROVED" />
                        <button className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700">
                          Approve
                        </button>
                      </form>
                      <form action={updateAppointmentStatus}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="status" value="REJECTED" />
                        <button className="rounded-lg bg-rose-100 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-200">
                          Reject
                        </button>
                      </form>
                    </div>
                  )}
                  {(a.status === "APPROVED" || a.status === "RESCHEDULED") && (
                    <form action={updateAppointmentStatus}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="status" value="CANCELLED" />
                      <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200">
                        Cancel
                      </button>
                    </form>
                  )}

                  {/* Reschedule */}
                  <form action={updateAppointmentStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="status" value="RESCHEDULED" />
                    <input
                      type="datetime-local"
                      name="start"
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                    />
                    <button className="rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-200">
                      Reschedule
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

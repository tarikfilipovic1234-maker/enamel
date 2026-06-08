import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { moderateTestimonial, deleteTestimonial } from "@/app/actions/admin";
import { StatusPill } from "../page";

async function load() {
  try {
    return await prisma.testimonial.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }] });
  } catch (e) {
    console.error("loadTestimonials:", e);
    return [];
  }
}

export default async function AdminTestimonials() {
  const items = await load();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Testimonials</h1>

      {items.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-slate-400 shadow-sm">No testimonials yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((tm) => (
            <div key={tm.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{tm.patientName}</span>
                    <span className="text-amber-500">{"★".repeat(tm.rating)}</span>
                    <StatusPill status={tm.status} />
                  </div>
                  {tm.service && <div className="mt-1 text-sm text-slate-400">{tm.service}</div>}
                  <p className="mt-2 text-sm text-slate-600">
                    “{(tm.text as Record<string, string>)?.bs ?? (tm.text as Record<string, string>)?.en ?? ""}”
                  </p>
                  <div className="mt-2 text-xs text-slate-400">{formatDate(tm.createdAt, "bs")}</div>
                </div>
                <div className="flex gap-2">
                  {tm.status !== "APPROVED" && (
                    <form action={moderateTestimonial}>
                      <input type="hidden" name="id" value={tm.id} />
                      <input type="hidden" name="status" value="APPROVED" />
                      <button className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700">Approve</button>
                    </form>
                  )}
                  {tm.status !== "REJECTED" && (
                    <form action={moderateTestimonial}>
                      <input type="hidden" name="id" value={tm.id} />
                      <input type="hidden" name="status" value="REJECTED" />
                      <button className="rounded-lg bg-rose-100 px-3 py-1.5 text-sm font-medium text-rose-700 hover:bg-rose-200">Reject</button>
                    </form>
                  )}
                  <form action={deleteTestimonial}>
                    <input type="hidden" name="id" value={tm.id} />
                    <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-200">Delete</button>
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

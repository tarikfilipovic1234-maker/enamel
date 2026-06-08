import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { updateInquiryStatus } from "@/app/actions/admin";
import { StatusPill } from "../page";

async function loadInquiries() {
  try {
    return await prisma.contactInquiry.findMany({ orderBy: { createdAt: "desc" } });
  } catch (e) {
    console.error("loadInquiries:", e);
    return [];
  }
}

export default async function AdminInquiries() {
  const inquiries = await loadInquiries();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Contact inquiries</h1>

      {inquiries.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-slate-400 shadow-sm">
          No inquiries yet.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {inquiries.map((q) => (
            <div key={q.id} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{q.subject}</span>
                    <StatusPill status={q.status} />
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    {q.name} · {q.email}
                    {q.phone ? ` · ${q.phone}` : ""}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{q.message}</p>
                  <div className="mt-2 text-xs text-slate-400">
                    {formatDateTime(q.createdAt, "bs")}
                  </div>
                </div>
                <div className="flex gap-2">
                  {q.status !== "READ" && (
                    <form action={updateInquiryStatus}>
                      <input type="hidden" name="id" value={q.id} />
                      <input type="hidden" name="status" value="READ" />
                      <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200">
                        Mark read
                      </button>
                    </form>
                  )}
                  {q.status !== "RESPONDED" && (
                    <form action={updateInquiryStatus}>
                      <input type="hidden" name="id" value={q.id} />
                      <input type="hidden" name="status" value="RESPONDED" />
                      <button className="rounded-lg bg-teal-100 px-3 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-200">
                        Responded
                      </button>
                    </form>
                  )}
                  <a
                    href={`mailto:${q.email}?subject=Re: ${encodeURIComponent(q.subject)}`}
                    className="rounded-lg bg-sardinia-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sardinia-700"
                  >
                    Reply
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

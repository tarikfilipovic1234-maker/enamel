import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteStaff } from "@/app/actions/admin";

async function load() {
  try {
    return await prisma.staffMember.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  } catch (e) {
    console.error("loadStaff:", e);
    return [];
  }
}

export default async function AdminTeam() {
  const staff = await load();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Team &amp; hours</h1>
        <Link href="/admin/team/new" className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
          + New dentist
        </Link>
      </div>

      {staff.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-slate-400 shadow-sm">No dentists yet.</p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {staff.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-sm text-slate-500">
                  {(m.title as Record<string, string>)?.bs ?? ""}
                </div>
                {!m.isActive && <span className="text-xs text-slate-400">Hidden</span>}
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/team/${m.id}`} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200">
                  Edit
                </Link>
                <form action={deleteStaff}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-200">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

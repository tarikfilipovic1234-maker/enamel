import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteService } from "@/app/actions/admin";

async function loadServices() {
  try {
    return await prisma.service.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  } catch (e) {
    console.error("loadServices:", e);
    return [];
  }
}

export default async function AdminServices() {
  const services = await loadServices();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
        <Link
          href="/admin/services/new"
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          + New service
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-slate-400 shadow-sm">
          No services yet.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Duration</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((s) => (
                <tr key={s.id}>
                  <td className="px-5 py-3 font-medium">
                    {(s.name as Record<string, string>)?.bs ?? s.slug}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{s.durationMin} min</td>
                  <td className="px-5 py-3 text-slate-500">
                    {s.priceFrom ? `${s.priceFrom} KM` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        s.isActive ? "bg-teal-100 text-teal-700" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {s.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/services/${s.id}`}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
                      >
                        Edit
                      </Link>
                      <form action={deleteService}>
                        <input type="hidden" name="id" value={s.id} />
                        <button className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-200">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

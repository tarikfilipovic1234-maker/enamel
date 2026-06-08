import Link from "next/link";
import { upsertStaff } from "@/app/actions/admin";

type StaffData = {
  id: string;
  slug: string;
  name: string;
  title: unknown;
  bio: unknown;
  photoUrl: string | null;
  specialties: string[];
  order: number;
  isActive: boolean;
};

const loc = (v: unknown, k: "bs" | "en") =>
  (v as Record<string, string> | null)?.[k] ?? "";

const inputCls =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

export function StaffForm({ staff }: { staff?: StaffData }) {
  return (
    <form action={upsertStaff} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      {staff && <input type="hidden" name="id" value={staff.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Full name</span>
          <input name="name" defaultValue={staff?.name} required className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Slug</span>
          <input name="slug" defaultValue={staff?.slug} required className={inputCls} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Title (BS)</span>
          <input name="titleBs" defaultValue={loc(staff?.title, "bs")} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Title (EN)</span>
          <input name="titleEn" defaultValue={loc(staff?.title, "en")} className={inputCls} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Bio (BS)</span>
          <textarea name="bioBs" defaultValue={loc(staff?.bio, "bs")} rows={3} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Bio (EN)</span>
          <textarea name="bioEn" defaultValue={loc(staff?.bio, "en")} rows={3} className={inputCls} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Photo URL</span>
          <input name="photoUrl" defaultValue={staff?.photoUrl ?? ""} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Specialties (comma-separated)</span>
          <input name="specialties" defaultValue={staff?.specialties.join(", ")} className={inputCls} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Order</span>
          <input name="order" type="number" defaultValue={staff?.order ?? 0} className={inputCls} />
        </label>
        <label className="flex items-center gap-2 pt-6">
          <input name="isActive" type="checkbox" defaultChecked={staff?.isActive ?? true} className="h-4 w-4" />
          <span className="text-sm font-medium text-slate-600">Active</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700">
          {staff ? "Save changes" : "Create dentist"}
        </button>
        <Link href="/admin/team" className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200">
          Cancel
        </Link>
      </div>
    </form>
  );
}

import Link from "next/link";
import { upsertService } from "@/app/actions/admin";

type ServiceData = {
  id: string;
  slug: string;
  name: unknown;
  description: unknown;
  durationMin: number;
  priceFrom: number | null;
  category: string | null;
  order: number;
  isActive: boolean;
};

const loc = (v: unknown, k: "bs" | "en") =>
  (v as Record<string, string> | null)?.[k] ?? "";

const inputCls =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

export function ServiceForm({ service }: { service?: ServiceData }) {
  return (
    <form action={upsertService} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      {service && <input type="hidden" name="id" value={service.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Name (BS)</span>
          <input name="nameBs" defaultValue={loc(service?.name, "bs")} required className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Name (EN)</span>
          <input name="nameEn" defaultValue={loc(service?.name, "en")} required className={inputCls} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Description (BS)</span>
          <textarea name="descBs" defaultValue={loc(service?.description, "bs")} rows={3} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Description (EN)</span>
          <textarea name="descEn" defaultValue={loc(service?.description, "en")} rows={3} className={inputCls} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Slug</span>
          <input name="slug" defaultValue={service?.slug} required className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Category</span>
          <input name="category" defaultValue={service?.category ?? ""} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Order</span>
          <input name="order" type="number" defaultValue={service?.order ?? 0} className={inputCls} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Duration (min)</span>
          <input name="durationMin" type="number" defaultValue={service?.durationMin ?? 30} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Price from (KM)</span>
          <input name="priceFrom" type="number" defaultValue={service?.priceFrom ?? ""} className={inputCls} />
        </label>
        <label className="flex items-center gap-2 pt-6">
          <input name="isActive" type="checkbox" defaultChecked={service?.isActive ?? true} className="h-4 w-4" />
          <span className="text-sm font-medium text-slate-600">Active</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700">
          {service ? "Save changes" : "Create service"}
        </button>
        <Link href="/admin/services" className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200">
          Cancel
        </Link>
      </div>
    </form>
  );
}

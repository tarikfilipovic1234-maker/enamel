import Link from "next/link";
import { upsertPost } from "@/app/actions/admin";

type PostData = {
  id: string;
  slug: string;
  title: unknown;
  excerpt: unknown;
  body: unknown;
  coverImage: string | null;
  tags: string[];
  authorId: string | null;
  status: string;
};
type StaffOption = { id: string; name: string };

const loc = (v: unknown, k: "bs" | "en") =>
  (v as Record<string, string> | null)?.[k] ?? "";

const inputCls =
  "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

export function PostForm({
  post,
  authors,
}: {
  post?: PostData;
  authors: StaffOption[];
}) {
  return (
    <form action={upsertPost} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Title (BS)</span>
          <input name="titleBs" defaultValue={loc(post?.title, "bs")} required className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Title (EN)</span>
          <input name="titleEn" defaultValue={loc(post?.title, "en")} required className={inputCls} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Excerpt (BS)</span>
          <textarea name="excerptBs" defaultValue={loc(post?.excerpt, "bs")} rows={2} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Excerpt (EN)</span>
          <textarea name="excerptEn" defaultValue={loc(post?.excerpt, "en")} rows={2} className={inputCls} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Body (BS) — Markdown</span>
          <textarea name="bodyBs" defaultValue={loc(post?.body, "bs")} rows={10} className={`${inputCls} font-mono`} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Body (EN) — Markdown</span>
          <textarea name="bodyEn" defaultValue={loc(post?.body, "en")} rows={10} className={`${inputCls} font-mono`} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Slug</span>
          <input name="slug" defaultValue={post?.slug} required className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Cover image URL</span>
          <input name="coverImage" defaultValue={post?.coverImage ?? ""} className={inputCls} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Tags (comma-separated)</span>
          <input name="tags" defaultValue={post?.tags.join(", ")} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Author</span>
          <select name="authorId" defaultValue={post?.authorId ?? ""} className={inputCls}>
            <option value="">—</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Status</span>
          <select name="status" defaultValue={post?.status ?? "DRAFT"} className={inputCls}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700">
          {post ? "Save post" : "Create post"}
        </button>
        <Link href="/admin/blog" className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200">
          Cancel
        </Link>
      </div>
    </form>
  );
}

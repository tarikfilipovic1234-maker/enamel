import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { deletePost } from "@/app/actions/admin";

async function load() {
  try {
    return await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  } catch (e) {
    console.error("loadPosts:", e);
    return [];
  }
}

export default async function AdminBlog() {
  const posts = await load();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
        <Link href="/admin/blog/new" className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
          + New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-slate-400 shadow-sm">No posts yet.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Published</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3 font-medium">{(p.title as Record<string, string>)?.bs ?? p.slug}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.status === "PUBLISHED" ? "bg-teal-100 text-teal-700" : "bg-slate-200 text-slate-500"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{p.publishedAt ? formatDate(p.publishedAt, "bs") : "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/blog/${p.id}`} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200">Edit</Link>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-200">Delete</button>
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

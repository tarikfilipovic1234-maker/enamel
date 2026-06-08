import Link from "next/link";
import { UserButton } from "@stackframe/stack";
import { requireAdmin } from "@/lib/dal";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl gap-6 p-4 sm:p-6">
      <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col rounded-2xl bg-white p-5 shadow-sm lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-1">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-600 to-sardinia-600 text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c3.5 0 6 2.4 6 6 0 3.2-1.2 5-2 8-.5 1.9-1.2 4-4 4s-3.5-2.1-4-4c-.8-3-2-4.8-2-8 0-3.6 2.5-6 6-6Z" />
            </svg>
          </span>
          <span className="font-semibold tracking-tight">Enamel Admin</span>
        </Link>
        <div className="mt-8 flex-1">
          <AdminNav />
        </div>
        <Link
          href="/"
          className="rounded-xl px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-100"
        >
          ← View site
        </Link>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="mb-6 flex items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-sm">
          <span className="text-sm text-slate-500">
            Signed in as <strong className="text-slate-700">{user.primaryEmail}</strong>
          </span>
          <UserButton />
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

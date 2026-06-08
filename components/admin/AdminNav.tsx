"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/team", label: "Team & hours" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

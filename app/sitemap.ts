import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const staticPaths = ["", "/about", "/services", "/team", "/testimonials", "/blog", "/contact", "/appointment"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of locales) {
    for (const path of staticPaths) {
      entries.push({ url: `${base}/${lang}${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 });
    }
  }

  try {
    const [services, posts] = await Promise.all([
      prisma.service.findMany({ where: { isActive: true }, select: { slug: true } }),
      prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } }),
    ]);
    for (const lang of locales) {
      for (const s of services) entries.push({ url: `${base}/${lang}/services/${s.slug}`, priority: 0.6 });
      for (const p of posts) entries.push({ url: `${base}/${lang}/blog/${p.slug}`, priority: 0.5 });
    }
  } catch (e) {
    console.error("sitemap dynamic entries:", e);
  }

  return entries;
}

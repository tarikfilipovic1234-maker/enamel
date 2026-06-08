import "server-only";
import { prisma } from "./prisma";

/**
 * Read helpers used by public pages. Each guards against DB errors so the
 * site renders (with empty states) even before Neon is connected/seeded.
 */

export async function getActiveServices() {
  try {
    return await prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  } catch (e) {
    console.error("getActiveServices:", e);
    return [];
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    return await prisma.service.findUnique({ where: { slug } });
  } catch (e) {
    console.error("getServiceBySlug:", e);
    return null;
  }
}

export async function getActiveStaff() {
  try {
    return await prisma.staffMember.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  } catch (e) {
    console.error("getActiveStaff:", e);
    return [];
  }
}

export async function getApprovedTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("getApprovedTestimonials:", e);
    return [];
  }
}

export async function getPublishedPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { author: true },
    });
  } catch (e) {
    console.error("getPublishedPosts:", e);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { author: true },
    });
  } catch (e) {
    console.error("getPostBySlug:", e);
    return null;
  }
}

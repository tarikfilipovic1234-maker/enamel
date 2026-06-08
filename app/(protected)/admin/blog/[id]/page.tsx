import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/PostForm";

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  const { id } = await params;
  const [post, authors] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }).catch(() => null),
    prisma.staffMember
      .findMany({ select: { id: true, name: true }, orderBy: { order: "asc" } })
      .catch(() => []),
  ]);
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit post</h1>
      <div className="mt-6">
        <PostForm post={post} authors={authors} />
      </div>
    </div>
  );
}

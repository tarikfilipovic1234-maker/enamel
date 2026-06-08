import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/PostForm";

export default async function NewPostPage() {
  const authors = await prisma.staffMember
    .findMany({ select: { id: true, name: true }, orderBy: { order: "asc" } })
    .catch(() => []);
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New post</h1>
      <div className="mt-6">
        <PostForm authors={authors} />
      </div>
    </div>
  );
}

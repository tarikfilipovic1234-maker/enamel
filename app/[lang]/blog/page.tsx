import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/dictionaries";
import { cardGrid } from "@/lib/layout";
import { t, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { getPublishedPosts } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return { title: dict.blog.title, description: dict.blog.subtitle };
}

export default async function BlogPage({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <SectionHeading title={dict.blog.title} subtitle={dict.blog.subtitle} as="h1" />

      {posts.length > 0 ? (
        <div className={`mt-12 grid gap-6 ${cardGrid(posts.length)}`}>
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${lang}/blog/${post.slug}`}
              transitionTypes={["nav-forward"]}
              className="group surface flex h-full flex-col overflow-hidden rounded-[var(--radius-card)]"
            >
              {post.coverImage && (
                <div className="relative aspect-[16/10] overflow-hidden border-b border-ink/10">
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                {post.publishedAt && (
                  <span className="text-xs text-ink/40">
                    {formatDate(post.publishedAt, lang as Locale)}
                  </span>
                )}
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">
                  {t(post.title, lang as Locale)}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/60">
                  {t(post.excerpt, lang as Locale)}
                </p>
                <span className="mt-4 text-sm font-medium text-teal-700">
                  {dict.common.readMore}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-ink/50">{dict.blog.empty}</p>
      )}
    </div>
  );
}

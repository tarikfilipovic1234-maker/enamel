import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/dictionaries";
import { t, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { getPublishedPosts } from "@/lib/data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";

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
      <SectionHeading eyebrow={dict.nav.blog} title={dict.blog.title} subtitle={dict.blog.subtitle} />

      {posts.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) * 0.07}>
              <Link
                href={`/${lang}/blog/${post.slug}`}
                transitionTypes={["nav-forward"]}
                className="group glass flex h-full flex-col overflow-hidden rounded-[var(--radius-card)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-teal-600 to-sardinia-700">
                  {post.coverImage && (
                    <Image
                      src={post.coverImage}
                      alt={t(post.title, lang as Locale)}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
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
                    {dict.common.readMore} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-ink/50">{dict.blog.empty}</p>
      )}
    </div>
  );
}

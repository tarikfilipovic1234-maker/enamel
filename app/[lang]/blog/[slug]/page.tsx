import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { t, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { getPostBySlug } from "@/lib/data";
import { Prose } from "@/components/ui/Prose";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: t(post.title, lang as Locale),
    description: t(post.excerpt, lang as Locale),
    openGraph: post.coverImage ? { images: [post.coverImage] } : undefined,
  };
}

export default async function BlogPostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang as Locale);
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href={`/${lang}/blog`}
        transitionTypes={["nav-back"]}
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-900"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18 9 12l6-6" />
        </svg>
        {dict.blog.backToBlog}
      </Link>

      <Reveal>
        <div className="mt-6">
          {post.publishedAt && (
            <time className="text-sm text-ink/40">
              {dict.blog.published} · {formatDate(post.publishedAt, lang as Locale)}
            </time>
          )}
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            {t(post.title, lang as Locale)}
          </h1>
          {post.author && (
            <p className="mt-3 text-sm text-ink/50">{post.author.name}</p>
          )}
        </div>
      </Reveal>

      {post.coverImage && (
        <Reveal delay={0.05}>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)]">
            <Image src={post.coverImage} alt={t(post.title, lang as Locale)} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
          </div>
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <div className="mt-10">
          <Prose>{t(post.body, lang as Locale)}</Prose>
        </div>
      </Reveal>
    </article>
  );
}

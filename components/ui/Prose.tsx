import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders Markdown content with the brand's editorial styling. */
export function Prose({ children }: { children: string }) {
  return (
    <div className="space-y-4 text-lg leading-relaxed text-ink/75 [&_a]:text-teal-700 [&_a]:underline [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

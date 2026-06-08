import Image from "next/image";
import { t, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";

type StaffLike = {
  name: string;
  title: unknown;
  bio: unknown;
  photoUrl: string | null;
  specialties: string[];
};

export function StaffCard({
  staff,
  lang,
  dict,
}: {
  staff: StaffLike;
  lang: Locale;
  dict: Dictionary;
}) {
  return (
    <article className="group glass overflow-hidden rounded-[var(--radius-card)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-teal-600 to-sardinia-700">
        {staff.photoUrl ? (
          <Image
            src={staff.photoUrl}
            alt={staff.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-white/90">
            <span className="font-display text-5xl font-semibold">
              {staff.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-ink">{staff.name}</h3>
        <p className="text-sm font-medium text-teal-700">{t(staff.title, lang)}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/60">
          {t(staff.bio, lang)}
        </p>
        {staff.specialties.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2" aria-label={dict.team.specialties}>
            {staff.specialties.slice(0, 3).map((s) => (
              <span key={s} className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-medium text-teal-700">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

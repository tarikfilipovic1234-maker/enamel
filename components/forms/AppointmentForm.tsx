"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { createAppointment, fetchSlots } from "@/app/actions/appointment";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

type ServiceOpt = { id: string; slug: string; name: string; durationMin: number };
type StaffOpt = { id: string; name: string };

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function AppointmentForm({
  lang,
  dict,
  services,
  staff,
  initialServiceSlug,
}: {
  lang: Locale;
  dict: Dictionary;
  services: ServiceOpt[];
  staff: StaffOpt[];
  initialServiceSlug?: string;
}) {
  const initialId =
    services.find((s) => s.slug === initialServiceSlug)?.id ?? services[0]?.id ?? "";

  const [serviceId, setServiceId] = useState(initialId);
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, startSlots] = useTransition();

  const [state, action, pending] = useActionState(createAppointment, undefined);

  useEffect(() => {
    setSlot("");
    if (!serviceId || !date) {
      setSlots([]);
      return;
    }
    startSlots(async () => {
      const result = await fetchSlots(serviceId, staffId || null, date);
      setSlots(result);
    });
  }, [serviceId, staffId, date]);

  const slotLabels = useMemo(
    () =>
      slots.map((iso) => ({
        iso,
        label: new Date(iso).toLocaleTimeString(lang === "bs" ? "bs-BA" : "en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    [slots, lang],
  );

  if (state?.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass flex flex-col items-center rounded-[var(--radius-card)] p-12 text-center"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-gradient text-white">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 4 4L19 6" />
          </svg>
        </span>
        <h3 className="mt-6 font-display text-2xl font-semibold text-ink">{dict.appointment.successTitle}</h3>
        <p className="mt-2 max-w-md text-ink/60">{dict.appointment.successText}</p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="glass rounded-[var(--radius-card)] p-7 sm:p-9">
      <input type="hidden" name="locale" value={lang} />
      <input type="hidden" name="serviceId" value={serviceId} />
      <input type="hidden" name="staffId" value={staffId} />
      <input type="hidden" name="start" value={slot} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="service">{dict.appointment.service}</Label>
          <Select
            id="service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
          >
            <option value="" disabled>
              {dict.appointment.selectService}
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.durationMin} {dict.common.minutes}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="dentist">{dict.appointment.dentist}</Label>
          <Select id="dentist" value={staffId} onChange={(e) => setStaffId(e.target.value)}>
            <option value="">{dict.appointment.anyDentist}</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mt-5">
        <Label htmlFor="date">{dict.appointment.date}</Label>
        <Input
          id="date"
          type="date"
          min={todayStr()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Slots */}
      {date && (
        <div className="mt-5">
          <Label>{dict.appointment.time}</Label>
          {loadingSlots ? (
            <p className="text-sm text-ink/50">{dict.appointment.loadingSlots}</p>
          ) : slotLabels.length > 0 ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slotLabels.map((s) => (
                <button
                  type="button"
                  key={s.iso}
                  onClick={() => setSlot(s.iso)}
                  className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition-all ${
                    slot === s.iso
                      ? "border-transparent bg-brand-gradient text-white shadow-[var(--shadow-glow)]"
                      : "border-teal-900/10 bg-white/60 text-ink/80 hover:border-teal-500/40"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink/50">{dict.appointment.noSlots}</p>
          )}
        </div>
      )}

      {/* Patient details */}
      <div className="mt-6 grid gap-5 border-t border-teal-900/10 pt-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="patientName">{dict.appointment.name}</Label>
          <Input id="patientName" name="patientName" required minLength={2} autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="patientEmail">{dict.appointment.email}</Label>
          <Input id="patientEmail" name="patientEmail" type="email" required autoComplete="email" />
        </div>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="patientPhone">{dict.appointment.phone}</Label>
          <Input id="patientPhone" name="patientPhone" required minLength={6} autoComplete="tel" />
        </div>
      </div>
      <div className="mt-5">
        <Label htmlFor="notes">{dict.appointment.notes}</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>

      {state && !state.ok && (
        <p className="mt-4 text-sm text-accent-600">
          {state.error === "slot" ? dict.validation.slotTaken : dict.appointment.errorGeneric}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending || !slot} className="mt-6 w-full">
        {pending ? dict.appointment.submitting : dict.appointment.submit}
      </Button>
    </form>
  );
}

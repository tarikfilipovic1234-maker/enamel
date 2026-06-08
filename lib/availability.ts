import "server-only";
import { prisma } from "./prisma";

const SLOT_STEP_MIN = 30; // granularity of offered start times

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Available appointment start times (ISO strings) for a given service + date,
 * optionally scoped to one dentist. With no dentist ("any"), a slot is offered
 * if at least one active dentist is free.
 */
export async function getAvailableSlots(opts: {
  serviceId: string;
  staffId?: string | null;
  date: string; // YYYY-MM-DD
}): Promise<string[]> {
  const { serviceId, staffId, date } = opts;
  try {
    const [y, m, d] = date.split("-").map(Number);
    if (!y || !m || !d) return [];

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    const duration = service?.durationMin ?? 30;

    const dayStart = new Date(y, m - 1, d, 0, 0, 0, 0);
    const dayEnd = new Date(y, m - 1, d, 23, 59, 59, 999);
    const dayOfWeek = dayStart.getDay();

    const staff = await prisma.staffMember.findMany({
      where: staffId ? { id: staffId } : { isActive: true },
      include: {
        workingHours: { where: { dayOfWeek } },
        timeOff: { where: { start: { lt: dayEnd }, end: { gt: dayStart } } },
      },
    });
    if (staff.length === 0) return [];

    const appts = await prisma.appointment.findMany({
      where: {
        status: "APPROVED",
        staffId: { in: staff.map((s) => s.id) },
        start: { gte: dayStart, lte: dayEnd },
      },
    });

    const now = Date.now();
    const available = new Set<string>();

    for (const member of staff) {
      const hours = member.workingHours[0];
      if (!hours) continue;

      const memberAppts = appts
        .filter((a) => a.staffId === member.id)
        .map((a) => [a.start.getTime(), a.end.getTime()] as const);
      const memberOff = member.timeOff.map(
        (o) => [o.start.getTime(), o.end.getTime()] as const,
      );

      for (let min = hours.startMin; min + duration <= hours.endMin; min += SLOT_STEP_MIN) {
        const start = new Date(y, m - 1, d, 0, min, 0, 0);
        const startMs = start.getTime();
        const endMs = startMs + duration * 60_000;

        if (startMs <= now + 60 * 60_000) continue; // at least 1h lead time
        const blocked =
          memberAppts.some(([s, e]) => overlaps(startMs, endMs, s, e)) ||
          memberOff.some(([s, e]) => overlaps(startMs, endMs, s, e));
        if (!blocked) available.add(start.toISOString());
      }
    }

    return [...available].sort();
  } catch (e) {
    console.error("getAvailableSlots:", e);
    return [];
  }
}

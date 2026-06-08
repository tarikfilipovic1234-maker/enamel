import { saveWorkingHours, addTimeOff, deleteTimeOff } from "@/app/actions/admin";
import { formatDateTime } from "@/lib/format";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Time options every 30 min, 07:00–20:00.
const TIME_OPTIONS = Array.from({ length: (20 - 7) * 2 + 1 }, (_, i) => {
  const min = 7 * 60 + i * 30;
  const label = `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
  return { min, label };
});

type Hours = { dayOfWeek: number; startMin: number; endMin: number };
type Off = { id: string; start: Date; end: Date; reason: string | null };

const selectCls = "rounded-lg border border-slate-200 px-2 py-1.5 text-sm";

export function AvailabilityEditor({
  staffId,
  workingHours,
  timeOff,
}: {
  staffId: string;
  workingHours: Hours[];
  timeOff: Off[];
}) {
  const byDay = new Map(workingHours.map((h) => [h.dayOfWeek, h]));

  return (
    <div className="space-y-6">
      {/* Working hours */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Working hours</h2>
        <form action={saveWorkingHours} className="mt-4 space-y-2">
          <input type="hidden" name="staffId" value={staffId} />
          {DAYS.map((day, i) => {
            const h = byDay.get(i);
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="w-28 text-sm text-slate-600">{day}</span>
                <select name={`start_${i}`} defaultValue={h?.startMin ?? ""} className={selectCls}>
                  <option value="">—</option>
                  {TIME_OPTIONS.map((o) => (
                    <option key={o.min} value={o.min}>{o.label}</option>
                  ))}
                </select>
                <span className="text-slate-400">to</span>
                <select name={`end_${i}`} defaultValue={h?.endMin ?? ""} className={selectCls}>
                  <option value="">—</option>
                  {TIME_OPTIONS.map((o) => (
                    <option key={o.min} value={o.min}>{o.label}</option>
                  ))}
                </select>
              </div>
            );
          })}
          <button className="mt-3 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700">
            Save hours
          </button>
        </form>
      </div>

      {/* Time off */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Time off</h2>
        <form action={addTimeOff} className="mt-4 flex flex-wrap items-end gap-3">
          <input type="hidden" name="staffId" value={staffId} />
          <label className="text-sm">
            <span className="block text-slate-600">Start</span>
            <input type="datetime-local" name="start" required className={selectCls} />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600">End</span>
            <input type="datetime-local" name="end" required className={selectCls} />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600">Reason</span>
            <input name="reason" className={selectCls} />
          </label>
          <button className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
            Add
          </button>
        </form>

        {timeOff.length > 0 && (
          <ul className="mt-4 divide-y divide-slate-100">
            {timeOff.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-slate-600">
                  {formatDateTime(o.start, "bs")} → {formatDateTime(o.end, "bs")}
                  {o.reason ? ` · ${o.reason}` : ""}
                </span>
                <form action={deleteTimeOff}>
                  <input type="hidden" name="id" value={o.id} />
                  <input type="hidden" name="staffId" value={staffId} />
                  <button className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-200">
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

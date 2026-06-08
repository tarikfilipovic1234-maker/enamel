import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StaffForm } from "@/components/admin/StaffForm";
import { AvailabilityEditor } from "@/components/admin/AvailabilityEditor";

export default async function EditStaffPage({ params }: PageProps<"/admin/team/[id]">) {
  const { id } = await params;
  const staff = await prisma.staffMember
    .findUnique({
      where: { id },
      include: {
        workingHours: { orderBy: { dayOfWeek: "asc" } },
        timeOff: { orderBy: { start: "asc" } },
      },
    })
    .catch(() => null);
  if (!staff) notFound();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit dentist</h1>
        <div className="mt-6">
          <StaffForm staff={staff} />
        </div>
      </div>
      <AvailabilityEditor
        staffId={staff.id}
        workingHours={staff.workingHours}
        timeOff={staff.timeOff}
      />
    </div>
  );
}

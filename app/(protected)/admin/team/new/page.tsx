import { StaffForm } from "@/components/admin/StaffForm";

export default function NewStaffPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New dentist</h1>
      <div className="mt-6">
        <StaffForm />
      </div>
    </div>
  );
}

import { ServiceForm } from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">New service</h1>
      <div className="mt-6">
        <ServiceForm />
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default async function EditServicePage({
  params,
}: PageProps<"/admin/services/[id]">) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } }).catch(() => null);
  if (!service) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Edit service</h1>
      <div className="mt-6">
        <ServiceForm service={service} />
      </div>
    </div>
  );
}

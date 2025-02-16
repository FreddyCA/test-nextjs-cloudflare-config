import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import EditForm from "@/app/ui/invoices/edit-form";
import { Metadata } from "next";

export const runtime = "edge";

export const metadata: Metadata = {
  title: 'Edit Invoice',
};
export default async function EditIdPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);


  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditForm invoice={invoice} customers={customers} />
    </main>
  );
}

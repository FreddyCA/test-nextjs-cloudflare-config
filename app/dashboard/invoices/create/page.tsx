// import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from "@/app/lib/data";
import FormInvoice from "@/app/ui/invoices/create-form";
import { Metadata } from "next";

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Invoices Create',
};
export default async function InvoicePage() {
  const responseCustomers = await fetchCustomers();
 
  return (
    <main>
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      /> */}
      <FormInvoice customers={responseCustomers} />
    </main>
  );
}

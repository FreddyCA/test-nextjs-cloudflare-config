// actions.ts -> use server authenticate, CRUD
// data.ts -> fetchRevenue fetchLatestInvoices fetchCardData fetchFilteredInvoices fetchInvoicesPages fetchInvoiceById fetchCustomers fetchFilteredCustomers getUser
// definitions.ts -> export type InvoiceForm = {}
// placeholder-data.js -> DATOS INICIALES const etc = [{}], module.export = {etc}
// utils.ts formatCurrency formatDateToLocal generateYAxis generatePagination
"use server";

import { eq } from "drizzle-orm";
import { db } from "./db";
import { invoicesTable } from "./db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { CreateInvoiceState } from "./definitions";

export async function deleteInvoice(id: string) {
  try {
    await db.delete(invoicesTable).where(eq(invoicesTable.id, id)).execute();

    // Asumiendo que `revalidatePath` es una función para revalidar la caché o similar
    revalidatePath("/dashboard/invoices");

    return { message: "Deleted Invoice." };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}

// CREATE INVOICE
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(
  prevState: CreateInvoiceState,
  formData: FormData
): Promise<CreateInvoiceState> {
  // Validado por zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: parseFloat(formData.get("amount") as string),
    status: formData.get("status"),
  });

  // Validando la respuesta de safeParse
  if (!validatedFields.success) {
    return {
      message: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Preparando data para inserción
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    const invoicesNewUUID: string = uuidv4();

    await db
      .insert(invoicesTable)
      .values({
        id: invoicesNewUUID,
        customer_id: customerId,
        amount: amountInCents,
        status,
        date,
      })
      .execute();
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return { message: "No se creó la factura", errors: {} };
  }
  redirect("/dashboard/invoices");
}

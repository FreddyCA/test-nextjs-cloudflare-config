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

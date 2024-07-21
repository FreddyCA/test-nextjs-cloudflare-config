"use server";

import { z } from "zod";
import { CreateInvoiceState } from "./definitions";
import { db } from "./db";
import { invoicesTable } from "./db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// DELETE INVOICE
export async function deleteInvoice(id: string) {
  try {
    await db.delete(invoicesTable).where(eq(invoicesTable.id, id));
    revalidatePath("/dashboard/invoices");
    return { success: true, message: "Invoice deleted successfully." };
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    return {
      success: false,
      message: "Database Error: Failed to delete invoice.",
    };
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
  // const date = new Date().toISOString().split("T")[0]; -> sin horas, min ni seg
  const date = new Date().toISOString();

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

// EDIT INVOICE
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: CreateInvoiceState,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await db
      .update(invoicesTable)
      .set({
        customer_id: customerId,
        amount: amountInCents,
        status: status,
      })
      .where(eq(invoicesTable.id, id));
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return { message: "No se editó la factura", errors: {} };
  }
  redirect("/dashboard/invoices");
}

// USER LOGIN
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

"use server";

import { unstable_noStore as noStore } from "next/cache";
import { db } from "./db";
import { customersTable, invoicesTable, revenueTable } from "./db/schema";
import { asc, count, desc, eq, or, sql, sum } from "drizzle-orm";
import { formatCurrency } from "./utils";

export async function fetchRevenue() {
  noStore();

  try {
    const data = await db.select().from(revenueTable);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await db
      .select({
        amount: invoicesTable.amount,
        name: customersTable.name,
        image_url: customersTable.image_url,
        email: customersTable.email,
        id: invoicesTable.id,
      })
      .from(invoicesTable)
      .innerJoin(
        customersTable,
        eq(invoicesTable.customer_id, customersTable.id)
      )
      .orderBy(desc(invoicesTable.date))
      .limit(5);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch LASTES INVOICES data.");
  }
}

export async function fetchCardData() {
  noStore();
  try {
    const data = await db
      .select({
        amount: invoicesTable.amount,
        status: invoicesTable.status,
        customer_id: invoicesTable.customer_id,
      })
      .from(invoicesTable);

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await db
      .select({
        id: invoicesTable.id,
        amount: invoicesTable.amount,
        date: invoicesTable.date,
        status: invoicesTable.status,
        name: customersTable.name,
        email: customersTable.email,
        image_url: customersTable.image_url,
      })
      .from(invoicesTable)
      .leftJoin(
        customersTable,
        eq(invoicesTable.customer_id, customersTable.id)
      )
      .where(
        or(
          sql`LOWER(${customersTable.name}) LIKE LOWER(${`%${query}%`})`,
          sql`LOWER(${customersTable.email}) LIKE LOWER(${`%${query}%`})`,
          !isNaN(Number(query))
            ? eq(invoicesTable.amount, Number(query))
            : sql`1=0`, // Verifica si el query es un número
          sql`LOWER(${invoicesTable.status}) LIKE LOWER(${`%${query}%`})`,
          sql`LOWER(${invoicesTable.date}) LIKE LOWER(${`%${query}%`})`
        )
      )
      .orderBy(sql`${invoicesTable.date} DESC`)
      .limit(ITEMS_PER_PAGE)
      .offset(offset);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const data = await db
      .select()
      .from(invoicesTable)
      .leftJoin(
        customersTable,
        eq(invoicesTable.customer_id, customersTable.id)
      )
      .where(
        or(
          sql`LOWER(${customersTable.name}) LIKE LOWER(${`%${query}%`})`,
          sql`LOWER(${customersTable.email}) LIKE LOWER(${`%${query}%`})`,
          !isNaN(Number(query))
            ? eq(invoicesTable.amount, Number(query))
            : sql`1=0`, // Verifica si el query es un número
          sql`LOWER(${invoicesTable.status}) LIKE LOWER(${`%${query}%`})`,
          sql`LOWER(${invoicesTable.date}) LIKE LOWER(${`%${query}%`})`
        )
      );
    const totalPages = Math.ceil(Number(data.length) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices page.");
  }
}

export async function fetchCustomers() {
  noStore();
  try {
    const data = await db
      .select({ id: customersTable.id, name: customersTable.name })
      .from(customersTable)
      .orderBy(asc(customersTable.name));
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await db
      .select({
        id: invoicesTable.id,
        customer_id: invoicesTable.customer_id,
        amount: invoicesTable.amount,
        status: invoicesTable.status,
      })
      .from(invoicesTable)
      .where(eq(invoicesTable.id, id));

    if (data.length === 0) {
      throw new Error("Invoice not found");
    }
    const invoice = data[0];

    const dataInvoice = {
      ...invoice,
      amount: invoice.amount / 100,
    };
    return dataInvoice;
  } catch (error) {
    throw new Error("Failed to fetch invoice ID.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();

  try {
    const data = await db
      .select({
        id: customersTable.id,
        name: customersTable.name,
        email: customersTable.email,
        image_url: customersTable.image_url,
        total_invoices: count(invoicesTable.id),
        total_pending: sum(
          sql`CASE WHEN ${invoicesTable.status} = 'pending' THEN ${invoicesTable.amount} ELSE 0 END`
        ),
        total_paid: sum(
          sql`CASE WHEN ${invoicesTable.status} = 'paid' THEN ${invoicesTable.amount} ELSE 0 END`
        ),
      })
      .from(customersTable)
      .leftJoin(invoicesTable, eq(customersTable.id, invoicesTable.customer_id))
      .where(
        or(
          sql`LOWER(${customersTable.name}) LIKE LOWER(${`%${query}%`})`,
          sql`LOWER(${customersTable.email}) LIKE LOWER(${`%${query}%`})`
        )
      )
      .groupBy(
        customersTable.id,
        customersTable.name,
        customersTable.email,
        customersTable.image_url
      )
      .orderBy(asc(customersTable.name))
      .execute();

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(Number(customer.total_pending)),
      total_paid: formatCurrency(Number(customer.total_paid)),
    }));

    return customers;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customer table.");
  }
}

"use server";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "./db";
import { customersTable, invoicesTable, revenueTable } from "./db/schema";
import { asc, desc, eq, or, sql } from "drizzle-orm";

export async function fetchRevenue() {
  // evitamos que se almacene en cache del cliente
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
      ) // Uso de eq para la condición
      .orderBy(desc(invoicesTable.date)) // Uso de desc para ordenación descendente
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

"use server";
import { unstable_noStore as noStore } from "next/cache";
import { PokeapiResponse } from "./definitions";
import { db } from "./db";
import { customersTable, invoicesTable, revenueTable } from "./db/schema";
import { desc, eq, ilike, sql } from "drizzle-orm";

export async function getDataPokeapi(): Promise<PokeapiResponse> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

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
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  noStore();

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
      .innerJoin(customersTable, eq(invoicesTable.customer_id, customersTable.id))
      .where(sql`${ilike(customersTable.name, `%${query}%`)}
              OR ${ilike(customersTable.email, `%${query}%`)}
              OR ${ilike(invoicesTable.amount, `%${query}%`)}
              OR ${ilike(invoicesTable.date, `%${query}%`)}
              OR ${ilike(invoicesTable.status, `%${query}%`)}`)
      .orderBy(desc(invoicesTable.date))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}
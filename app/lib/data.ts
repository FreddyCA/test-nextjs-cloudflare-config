"use server";
import { unstable_noStore as noStore } from "next/cache";
import { PokeapiResponse } from "./definitions";
import { db } from "./db";
import { customersTable, invoicesTable, revenueTable } from "./db/schema";
import { desc, eq } from "drizzle-orm";

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

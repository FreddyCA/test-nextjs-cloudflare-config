// actions.ts -> use server authenticate, CRUD
// data.ts -> fetchRevenue fetchLatestInvoices fetchCardData fetchFilteredInvoices fetchInvoicesPages fetchInvoiceById fetchCustomers fetchFilteredCustomers getUser
// definitions.ts -> export type InvoiceForm = {}
// placeholder-data.js -> DATOS INICIALES const etc = [{}], module.export = {etc}
// utils.ts formatCurrency formatDateToLocal generateYAxis generatePagination
export const getDataPokeapi = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon");
  if (!res.ok) {
    throw new Error("Fallo el fetching");
  }

  return res.json();
};

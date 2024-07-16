import { getDataPokeapi } from "@/app/lib/data";

export default async function customersPage() {
  const response = await getDataPokeapi();

  return <div>{response.count}</div>;
}

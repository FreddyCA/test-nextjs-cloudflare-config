import { getDataPokeapi } from "@/app/lib/actions";

export default async function InvoicesPage() {
  const data = await getDataPokeapi();
  return <div>{data.count}</div>;
}

import { getDataPokeapi } from "@/app/lib/data";
import { Pokemon } from "@/app/lib/definitions";
import Link from "next/link";

export default async function InvoicesPage() {
  const data = await getDataPokeapi();
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
      }}
    >
      {data.results.map((pokemon: Pokemon) => (
        <div
          key={pokemon.name}
          style={{
            width: "200px",
            padding: "2rem 1rem",
            borderRadius: "10%",
            border: "2px solid black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <p>{pokemon.name}</p>
          <Link href={pokemon.url} target="_blank">
            Link to {pokemon.name}
          </Link>
        </div>
      ))}
    </div>
  );
}

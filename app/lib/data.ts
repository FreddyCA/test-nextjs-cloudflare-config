import { PokeapiResponse } from "./definitions";

export async function getDataPokeapi(): Promise<PokeapiResponse> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

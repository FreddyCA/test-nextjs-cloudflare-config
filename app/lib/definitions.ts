export type Pokemon = {
  name: string;
  url: string;
};

export type PokeapiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
};

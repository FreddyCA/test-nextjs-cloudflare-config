"use client";
import { getDataPokeapi } from "@/app/lib/data";
import { PokeapiResponse, Pokemon } from "@/app/lib/definitions";
import Link from "next/link";
import { useState } from "react";

export default function InvoicesPage() {
  const [dataResponse, setDataResponse] = useState<PokeapiResponse>();
  const [dataDB, setDataDB] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const data = await getDataPokeapi();

      // const response = await fetch("/api/insert-users", {
      //   method: "POST",
      // });
      // const response = await fetch("/api/insert-invoices", {
      //   method: "POST",
      // });
      // const response = await fetch("/api/insert-customers", {
      //   method: "POST",
      // });
      const response = await fetch("/api/insert-revenue", {
        method: "POST",
      });

      const dataInsert = await response.json();
      if (dataInsert.ok) {
        setDataDB(true);
      }

      setDataResponse(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
      }}
    >
      <div>
        <button onClick={fetchData}>Enviar revenue</button>
      </div>
      {dataDB && <h2>se envio la data a la db</h2>}
      {dataResponse && (
        <>
          {dataResponse.results.map((pokemon: Pokemon) => (
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
        </>
      )}
    </div>
  );
}

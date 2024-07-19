"use client";
import { useRouter } from "next/navigation";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); // Redirige al home si no hay historial
    }
  };

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 p-6">
      <FaceFrownIcon className="w-16 h-16 text-gray-500" />
      <h1 className="text-3xl font-bold text-gray-800">404 Not Found</h1>
      <p className="text-lg text-gray-600">
        The requested invoice could not be found.
      </p>
      <button
        onClick={handleGoBack}
        className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-500"
      >
        Return
      </button>
    </main>
  );
}

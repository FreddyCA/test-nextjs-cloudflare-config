'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Opcionalmente, puedes registrar el error en un servicio de informes de errores
    console.error('Error:', error);
  }, [error]);

  const handleRedirect = () => {
    // Redirige al home y limpia el historial de navegación
    router.replace('/');
  };

  return (
    <main className="flex h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Something went wrong!</h2>
        <p className="text-lg text-gray-600 mb-6">An unexpected error has occurred. Please try again later.</p>
        <button
          className="inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-500"
          onClick={handleRedirect}
        >
          Go to Home
        </button>
      </div>
    </main>
  );
}

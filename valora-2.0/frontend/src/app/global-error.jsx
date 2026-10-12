"use client";

import ErrorPage from "@/components/ui/ErrorPage";

export default function GlobalError({ reset }) {
  return (
    <html lang="es">
      <body>
        <ErrorPage
          type={500}
          onRetry={reset}
        />
      </body>
    </html>
  );
}
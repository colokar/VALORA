"use client";

import ErrorPage from "@/components/ui/ErrorPage";

export default function Error({ reset }) {
  return (
    <ErrorPage
      type={500} 
      onRetry={reset} 
      buttonText="Volver al inicio" 
      buttonHref="/"
    />
  );
}
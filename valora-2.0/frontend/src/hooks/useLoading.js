// hooks/useLoading.js
"use client";

import { useState } from "react";

export function useLoading(minDuration = 700) {
  const [loading, setLoading] = useState(false);

  const withLoading = async (callback) => {
    setLoading(true);

    const start = Date.now();

    try {
      return await callback();
    } finally {
      const elapsed = Date.now() - start;

      if (elapsed < minDuration) {
        await new Promise((resolve) =>
          setTimeout(resolve, minDuration - elapsed)
        );
      }

      setLoading(false);
    }
  };

  return {
    loading,
    withLoading,
  };
}
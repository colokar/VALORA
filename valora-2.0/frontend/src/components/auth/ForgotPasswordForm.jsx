"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { Input } from "@/components/ui/Input";
import { BackButton } from "@/components/ui/BackButton";
import { API_BASE_URL } from "@/lib/axios";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL.replace(/\/+$/, "")}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage(data.message);
    } catch (error) {
      setError(error.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeIn>
      <div className="max-w-md mx-auto">
        <section className="bg-white rounded-3xl border p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <BackButton />
            <h3 className="text-3xl font-bold text-[#0B376D]">
              Recuperar contraseña
            </h3>
          </div>

          <p className="text-gray-500 mt-2 mb-6">
            Ingresá tu correo para continuar.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="ejemplo@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {message && (
              <div className="bg-green-50 text-green-700 rounded-xl p-3 text-sm">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#5B9B82] text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        </section>
      </div>
    </FadeIn>
  );
};

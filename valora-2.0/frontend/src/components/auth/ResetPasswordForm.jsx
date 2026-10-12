"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FadeIn } from "@/components/ui/FadeIn";
import { Input } from "@/components/ui/Input";
import { API_BASE_URL } from "@/lib/axios";

export const ResetPasswordForm = ({ token }) => {
  const router = useRouter();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL.replace(/\/+$/, "")}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword: form.newPassword }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage(data.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setError(error.message || "No se pudo cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeIn>
      <div className="max-w-md mx-auto">
        <section className="bg-white rounded-3xl border p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-[#0B376D]">Restablecer contraseña</h1>
          <p className="text-gray-500 mt-2 mb-6">Ingresá tu nueva contraseña.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nueva contraseña"
              type="password"
              placeholder="••••••••"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            {message && (
              <div className="bg-green-50 text-green-700 rounded-xl p-3 text-sm">{message}</div>
            )}
            {error && (
              <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm">{error}</div>
            )}

            <button
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#5B9B82] text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Cambiando..." : "Cambiar contraseña"}
            </button>
          </form>
        </section>
      </div>
    </FadeIn>
  );
};
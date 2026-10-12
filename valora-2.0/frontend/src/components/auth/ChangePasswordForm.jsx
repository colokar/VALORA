"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { updatePasswordService } from "@/services/authService";
import { BackButton } from "@/components/ui/BackButton";

export const ChangePasswordForm = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const password = form.newPassword || "";
  const passwordInvalida =
    password.length > 0 &&
    (password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setErrorMessage("Completá todos los campos.");
      return;
    }

    if (passwordInvalida) {
      setErrorMessage("La contraseña no cumple los requisitos.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      const response = await updatePasswordService({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setSuccessMessage(
        response.message || "Contraseña actualizada correctamente.",
      );
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => router.push("/perfil"), 1500);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "No se pudo actualizar la contraseña.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold text-[#0B376D]">Seguridad</h1>
        </div>
          <p className="mt-2 mb-6 text-sm text-gray-500">
            Cambiá tu contraseña para mantener segura tu cuenta.
          </p>
        

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Contraseña actual"
            type="password"
            name="currentPassword"
            placeholder="••••••••"
            value={form.currentPassword}
            onChange={handleChange}
          />

          <Input
            label="Nueva contraseña"
            type="password"
            name="newPassword"
            placeholder="••••••••"
            value={form.newPassword}
            onChange={handleChange}
          />

          {passwordInvalida && (
            <div className="text-sm text-[#5B9B82]">
              <p>*Mínimo 8 caracteres.</p>
              <p>*Debe incluir mayúsculas, minúsculas y números.</p>
            </div>
          )}

          <Input
            label="Confirmar nueva contraseña"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          {errorMessage && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full h-12 rounded-full bg-[#5B9B82] text-white font-semibold hover:bg-[#4E8C74] disabled:opacity-50"
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </form>
      </section>
    </>
  );
};

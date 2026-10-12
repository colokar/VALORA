"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Terminos } from "@/components/auth/Terminos";
import { registerService } from "@/services/authService";
import Loading from "../ui/loading/Loading";
import Spinner from "../ui/loading/Spinner";

export const RegisterForm = () => {
  const router = useRouter();

  const [mostrarTerminos, setMostrarTerminos] = useState(false);


  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      terminos: false,
    },
  });

  const password = watch("password") || "";

  const passwordInvalida =
    password.length > 0 &&
    (password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password));

  const onSubmit = async (data) => {
    try {
     
      const { repetirPassword, terminos, ...userData } = data;

      await registerService(userData);

      router.push("/login");
    } catch (error) {
      setError("email", {
        type: "manual",
        message:
          error.response?.data?.message ||
          error.message ||
          "Error al registrar usuario",
      });
    }
  };


  return (
    <div className="w-full max-w-md min-h-[calc(100vh-5rem)] flex flex-col justify-center py-10 mt-[-1rem] mb-[-6rem]">
      {isSubmitting && <Loading variant="overlay" text="Registrando..." />}

      {/* Logo */}

      <div className="flex justify-center mb-6">
        <Image
          src="/logo.png"
          alt="Logo InnovaLab"
          width={110}
          height={110}
          priority
        />
      </div>

      {/* Título */}

      <h1 className="text-4xl font-bold text-center text-[#0B376D] mb-8">
        Registrate
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre"
          placeholder="Agustín"
          error={!!errors.nombre}
          {...register("nombre")}
        />

        <Input
          label="Apellido"
          placeholder="López"
          error={!!errors.apellido}
          {...register("apellido")}
        />

        <Input
          label="Nombre de la Empresa"
          placeholder="Servicios Arg"
          error={!!errors.nombreEmprendimiento}
          {...register("nombreEmprendimiento")}
        />

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="Alopez@serviciosarg.com.ar"
          error={!!errors.email}
          {...register("email")}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••"
          error={!!errors.password}
          {...register("password")}
        />

        {passwordInvalida && (
          <div className="text-sm text-[#5B9B82] font-medium -mt-2">
            <p>*Debe tener un mínimo de 8 caracteres.</p>

            <p>
              *Incluir una combinación de letras mayúsculas, minúsculas y
              números.
            </p>
          </div>
        )}

        <Input
          label="Repetir contraseña"
          type="password"
          placeholder="••••••"
          error={!!errors.repetirPassword}
          {...register("repetirPassword")}
        />

        <label className="flex items-center gap-2 text-[#0B376D] font-medium">
          <input
            type="checkbox"
            className="accent-[#0B376D]"
            {...register("terminos")}
          />

          <span>
            Acepto los{" "}
            <button
              type="button"
              onClick={() => setMostrarTerminos(true)}
              className="text-[#5B9B82] font-semibold hover:underline"
            >
              términos y condiciones
            </button>
          </span>

          {errors.terminos && <span className="text-red-500">*</span>}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full
            h-12
            rounded-full
            bg-[#5B9B82]
            text-white
            font-semibold
            hover:bg-[#4E8C74]
            disabled:opacity-50
          "
        > 
        {isSubmitting && <Spinner />}
  {isSubmitting ? "Registrando..." : "Registrarse"}
        </button>

        <p className="text-center text-[17px] font-medium text-[#0B376D]">
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#5B9B82] hover:underline"
          >
            Iniciá sesión
          </Link>
        </p>
      </form>

      <Terminos
        open={mostrarTerminos}
        onClose={() => setMostrarTerminos(false)}
      />
    </div>
  );
};

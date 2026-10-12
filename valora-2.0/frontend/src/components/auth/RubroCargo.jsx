"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { AvatarEmpresa } from "@/components/ui/AvatarEmpresa";
import { BackButton } from "../ui/BackButton";
import Loading from "../ui/loading/Loading";
import Spinner from "../ui/loading/Spinner";
import {
  getMeService,
  updateUserRubroCargoService,
} from "@/services/authService";

export const MyDateRubroYCargoForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  // Precarga el formulario con los datos actuales del usuario
  useEffect(() => {
    getMeService()
      .then((res) => {
        setUser(res.user);
        const { cargo, rubro } = res.user;
        reset({ cargo, rubro });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const dataToSend = {
        ...data,
        userId: user.id,
      };
      await updateUserRubroCargoService(dataToSend);
      router.push("/perfil/datos");
    } catch (error) {
      setError("root", {
        type: "manual",
        message:
          error.response?.data?.message ||
          "No se pudieron guardar los cambios. Intentá nuevamente.",
      });
    }
  };

  if (loading) return <Loading text="Cargando datos rubro y cargo..." />;

  return (
    <>
      {isSubmitting && (
        <Loading variant="overlay" text="Guardando cambios..." />
      )}
      {/* Encabezado */}
      <div className="flex items-center mb-6">
        <BackButton />
        <h1 className="flex-1 text-center text-2xl font-bold text-black mr-8">
          Rubro y Cargo
        </h1>
      </div>

      {/* Logo Reutilizable  Avatar  */}
      <div className="flex justify-center mb-8">
        <AvatarEmpresa
          user={user}
          className="h-30 w-30"
          onEdit={() => router.push("/perfil/updateLogo")} // Redirección al hacer clic en el lápiz
        />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Rubro"
          error={errors.rubro?.message}
          {...register("rubro", { required: "El rubro es obligatorio" })}
        />

        <Input
          label="Cargo"
          error={errors.cargo?.message}
          {...register("cargo", { required: "El cargo es obligatorio" })}
        />

        {errors.root && (
          <p className="text-center text-sm text-red-500">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-[#5B9B82] text-white font-medium hover:bg-[#4E8C74] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Spinner />
              <span>Guardando...</span>
            </>
          ) : (
            "Guardar cambios"
          )}
        </button>
      </form>
    </>
  );
};

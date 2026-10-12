"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; 

export const BackButton = ({ onClick }) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Ejecuta la función personalizada si la pasaron (ej. cerrar un modal o vista interna)
      return;
    }

    // Verificamos si hay historial de navegación en la pestaña
    // window.history.length <= 2 suele indicar que el usuario abrió la página directamente
    if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      // Si no hay historial previo, evaluamos el estado de autenticación
      // (Aquí puedes cambiar "token" por la clave que uses en tu localStorage para saber si está logueado)
      const token = localStorage.getItem("token"); 

      if (token) {
        router.push("/perfil"); // Cambia por tu ruta de perfil real
      } else {
        router.push("/");       // Cambia por tu ruta de login real
      }
    }
  };

  return (
    <button 
  onClick={handleClick} 
  className="group p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer border-none bg-transparent"
>
  <ArrowLeft size={24} className="text-black transition-transform duration-200 group-hover:-translate-x-1" />
</button>
  );
};
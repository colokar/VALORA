"use client";

import { motion } from "framer-motion";

export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} // Reducimos el desplazamiento a 8px para que sea más sutil y elegante
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.25, // Un poco más rápido (250ms) se siente más inmediato y fluido al navegar
        ease: [0.25, 1, 0.5, 1] // Curva cúbica Bezier personalizada (ease-out suave)
      }}
      className="flex-grow flex flex-col w-full will-change-[opacity,transform]"
    >
      {children}
    </motion.div>
  );
}
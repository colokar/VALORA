"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function FadeIn({ children }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname} 
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ 
        duration: 0.25,        // Un poco más rápido para que se sienta inmediato
        ease: [0.16, 1, 0.3, 1] // Curva "Expo out": arranca rápido y frena súper suave
      }}
      className="w-full flex flex-col"
    >
      {children}
    </motion.div>
  );
}
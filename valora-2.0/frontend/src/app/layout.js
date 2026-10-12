import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import NavbarWrapper from "@/components/Navbar/NavbarWrapper";
import { FadeIn } from "@/components/ui/FadeIn";
import ScrollToTop from "@/components/ui/ScrollToTop";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Innova Lab",
    template: "%s | Innova Lab",
  },
  description: "Plataforma de gestión de presupuestos para emprendedores",
  robots: {
    index: false, // No indexar la app en buscadores (es una app privada)
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">

        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>

        {/* pb-24 asegura que el contenido no quede detrás del nav en las rutas protegidas */}
        <main className="min-h-screen bg-gray-50 pb-24">
          <div className="max-w-md mx-auto pt-4 px-4">
            <FadeIn>
              {children}
            </FadeIn>
          </div>
        </main>

        {/* El wrapper decidirá internamente si mostrarse o no */}
        <NavbarWrapper />

      </body>
    </html>
  );
}

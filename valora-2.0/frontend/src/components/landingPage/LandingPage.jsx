"use client";

import { useEffect, useRef, useState } from "react";

// Clases que aplica el reveal-on-scroll (deben existir tal cual en el código
// para que Tailwind las genere en el build)
const REVEAL_HIDDEN = ["opacity-0", "translate-y-7"];
const REVEAL_VISIBLE = ["opacity-100", "translate-y-0"];

export default function LandingPage() {
  const [headerShadow, setHeaderShadow] = useState(false);
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  const [ctaSuccess, setCtaSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const rootRef = useRef(null);

  useEffect(() => {
    function onScroll() {
      setHeaderShadow(window.scrollY > 12);
      setBackToTopVisible(window.scrollY > 480);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const revealEls = rootRef.current?.querySelectorAll("[data-reveal]");
    if (!revealEls || revealEls.length === 0) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove(...REVEAL_HIDDEN);
              entry.target.classList.add(...REVEAL_VISIBLE);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    } else {
      revealEls.forEach((el) => {
        el.classList.remove(...REVEAL_HIDDEN);
        el.classList.add(...REVEAL_VISIBLE);
      });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setCtaSuccess(true);
    setEmail("");
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const btnBase =
    "inline-flex items-center justify-center gap-2 rounded-xl font-bold cursor-pointer transition motion-reduce:transition-none";
  const btnPrimary = `${btnBase} px-7 py-3.5 text-[15px] bg-green text-white shadow-[0_8px_20px_rgba(31,169,113,0.35)] hover:bg-greenDark hover:-translate-y-0.5`;
  const btnOutline = `${btnBase} px-7 py-3.5 text-[15px] bg-transparent text-white border-[1.5px] border-white/40 hover:bg-white/10 hover:-translate-y-0.5`;
  const revealBase =
    "opacity-0 translate-y-7 transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0";

  return (
    <div
      ref={rootRef}
      className="font-sans text-navy bg-canvas leading-relaxed w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-x-hidden mt-[-1rem] mb-[-6rem]"
    >
      <header
        className="sticky top-0 z-50 bg-navy/[0.92] backdrop-blur-sm transition-shadow duration-300 motion-reduce:transition-none"
        style={{ boxShadow: headerShadow ? "0 8px 24px rgba(0,0,0,0.25)" : "none" }}
      >
        <div className="max-w-[1160px] mx-auto px-6">
          <nav className="flex items-center justify-between py-[18px]">
            <div className="group flex items-center gap-2.5 font-extrabold text-xl text-white tracking-[-0.01em]">
              <img
                src="/logo-white.png"
                alt="Valora"
                className="h-[26px] w-auto block transition-transform duration-300 group-hover:rotate-[-4deg] group-hover:scale-105"
              />
            </div>

            <div className="hidden lg:flex gap-9 text-[15px] font-semibold text-white/75">
              <a href="#funciones" className="hover:text-white transition-colors">Funciones</a>
              <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
              <a href="#pantallas" className="hover:text-white transition-colors">Pantallas</a>
              <a href="#cta" className="hover:text-white transition-colors">Empezar</a>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3.5 text-sm font-semibold">
                <a href="/login" className="text-white/75 hover:text-white transition-colors">
                  Iniciar sesión
                </a>
              </div>
              <a href="/register" className={`${btnPrimary} !px-[18px] !py-[9px] !text-[13.5px]`}>
                Probar la app
              </a>
            </div>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-br from-navy to-navy3 text-white pt-[88px] pb-[110px] relative overflow-hidden">
        <div className="max-w-[1160px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-12 text-center lg:text-left">
          <div>
            <span className="motion-reduce:animate-none animate-fadeInUp inline-block text-[13px] font-bold tracking-[0.06em] uppercase text-greenDark bg-green/10 px-3.5 py-1.5 rounded-full mb-4">
              Gestión de presupuestos
            </span>
            <h1 className="motion-reduce:animate-none animate-fadeInUp [animation-delay:0.1s] text-[28px] sm:text-4xl lg:text-[46px] font-extrabold leading-tight tracking-[-0.02em] mb-5">
              Gestioná tus presupuestos de forma simple y eficiente
            </h1>
            <p className="motion-reduce:animate-none animate-fadeInUp [animation-delay:0.2s] text-lg text-white/80 max-w-[520px] mb-8 mx-auto lg:mx-0">
              Creá, enviá y hacé seguimiento de todos tus presupuestos desde un solo lugar. Menos
              planillas, menos WhatsApp perdido, más presupuestos aprobados.
            </p>
            <div className="motion-reduce:animate-none animate-fadeInUp [animation-delay:0.3s] flex gap-3.5 mb-9 flex-wrap justify-center lg:justify-start">
              <a href="/register" className={btnPrimary}>Empezar gratis</a>
              <a href="#como-funciona" className={btnOutline}>Ver cómo funciona</a>
            </div>
            <p className="motion-reduce:animate-none animate-fadeInUp [animation-delay:0.4s] text-sm text-white/55">
              Pensada para freelancers, pymes y profesionales de servicios.
            </p>
          </div>

          <div className="motion-reduce:animate-none animate-fadeInUp [animation-delay:0.2s] relative flex justify-center items-center mt-10 lg:mt-0">
            <div className="motion-reduce:animate-none animate-floatYRotate w-[190px] sm:w-[230px] rounded-[34px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.45)] border-[6px] border-[#0E1730] bg-[#0E1730] shrink-0 rotate-[-2deg]">
              <img
                src="/onboarding1.png"
                alt="Pantalla principal de Valora mostrando el resumen de presupuestos"
                className="w-full h-full object-cover block"
              />
            </div>

            <div className="motion-reduce:animate-none animate-floatY hidden lg:block absolute top-[6%] left-[-8%] bg-white text-navy rounded-2xl px-4 py-3.5 shadow-[0_16px_30px_rgba(0,0,0,0.25)] text-[13px] min-w-[170px]">
              <div className="text-muted text-[11px] uppercase tracking-[0.04em] mb-1 font-bold">
                Total activo este mes
              </div>
              <div className="text-lg font-extrabold">$1.093.807</div>
            </div>

            <div className="motion-reduce:animate-none animate-floatYDelay hidden lg:block absolute bottom-[4%] right-[-10%] bg-white text-navy rounded-2xl px-4 py-3.5 shadow-[0_16px_30px_rgba(0,0,0,0.25)] text-[13px] min-w-[170px]">
              <div className="text-muted text-[11px] uppercase tracking-[0.04em] mb-1 font-bold">
                Juan Pérez · #P-0040
              </div>
              <div className="text-lg font-extrabold">
                $300.000{" "}
                <span className="inline-block text-[11px] font-bold px-2.5 py-[3px] rounded-full bg-orange/15 text-[#B87A16]">
                  Pendiente
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 text-center">
        <div className="max-w-[1160px] mx-auto px-6">
          <p className="text-muted text-sm font-semibold tracking-[0.03em] uppercase">
            Presupuestos, clientes y seguimiento — todo en una sola app
          </p>
        </div>
      </section>

      <section id="funciones" className="py-16 lg:py-24">
        <div className="max-w-[1160px] mx-auto px-6">
          <div data-reveal className={`${revealBase} text-center max-w-[620px] mx-auto mb-14`}>
            <span className="inline-block text-[13px] font-bold tracking-[0.06em] uppercase text-greenDark bg-green/10 px-3.5 py-1.5 rounded-full mb-4">
              Funciones
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold leading-tight tracking-[-0.02em] mb-3.5">
              Todo lo que necesitás para presupuestar mejor
            </h2>
            <p className="text-muted text-[17px]">
              Desde la primera cotización hasta el seguimiento del pago, Valora acompaña todo el proceso.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                ),
                title: "Creá presupuestos en segundos",
                text: "Completá datos, agregá ítems y condiciones, y generá el presupuesto en pocos pasos, sin planillas ni formatos sueltos.",
                delay: "0ms",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                ),
                title: "Todo el historial a tu alcance",
                text: "Consultá y filtrá todos tus presupuestos. Ordenalos por estado, fecha o buscá directamente por cliente.",
                delay: "80ms",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                ),
                title: "Enviá y hacé seguimiento",
                text: "Enviá tus presupuestos a tus clientes y hacé seguimiento del estado hasta su respuesta: pendiente, aprobado o rechazado.",
                delay: "160ms",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                ),
                title: "Dashboard con métricas claras",
                text: "Visualizá cuántos presupuestos aprobaste, cuáles siguen pendientes y tu actividad semanal de un vistazo.",
                delay: "240ms",
              },
            ].map((f) => (
              <div
                key={f.title}
                data-reveal
                style={{ transitionDelay: f.delay }}
                className={`${revealBase} bg-white border border-line rounded-[18px] p-8 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(22,35,63,0.08)]`}
              >
                <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center text-white mb-5">
                  {f.icon}
                </div>
                <h3 className="text-[19px] mb-2.5">{f.title}</h3>
                <p className="text-muted text-[15px]">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-navy text-white" id="como-funciona">
        <div className="max-w-[1160px] mx-auto px-6">
          <div data-reveal className={`${revealBase} text-center max-w-[620px] mx-auto mb-14`}>
            <span className="inline-block text-[13px] font-bold tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full mb-4 bg-green/[0.18] text-[#5CE0A6]">
              Cómo funciona
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold leading-tight tracking-[-0.02em] mb-3.5 text-white">
              De la idea al presupuesto enviado en 3 pasos
            </h2>
            <p className="text-[17px] text-white/65">
              Sin curva de aprendizaje: cargá un cliente y en minutos tenés el presupuesto listo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {[
              { n: 1, title: "Cargá tu cliente y servicio", text: "Buscá un cliente existente o agregá uno nuevo con sus datos de contacto en segundos.", delay: "0ms" },
              { n: 2, title: "Agregá ítems, precios y condiciones", text: "Sumá productos o servicios, definí cantidades, precios, validez y observaciones.", delay: "100ms" },
              { n: 3, title: "Generá y enviá el presupuesto", text: "Guardalo como borrador o enviálo directamente, y seguí su estado hasta que el cliente responda.", delay: "200ms" },
            ].map((s) => (
              <div
                key={s.n}
                data-reveal
                style={{ transitionDelay: s.delay }}
                className={`${revealBase} group bg-white/5 border border-white/10 rounded-[18px] p-8`}
              >
                <div className="w-[38px] h-[38px] rounded-[10px] bg-green flex items-center justify-center font-extrabold mb-[18px] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  {s.n}
                </div>
                <h3 className="text-lg mb-2.5">{s.title}</h3>
                <p className="text-white/65 text-[14.5px]">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pantallas" className="py-16 lg:py-24">
        <div className="max-w-[1160px] mx-auto px-6">
          <div data-reveal className={`${revealBase} text-center max-w-[620px] mx-auto mb-14`}>
            <span className="inline-block text-[13px] font-bold tracking-[0.06em] uppercase text-greenDark bg-green/10 px-3.5 py-1.5 rounded-full mb-4">
              Conocé la app
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold leading-tight tracking-[-0.02em] mb-3.5">
              Diseñada para que presupuestar sea simple
            </h2>
            <p className="text-muted text-[17px]">Un vistazo a las pantallas principales de Valora.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-7 px-1 pt-3 pb-6">
            {[
              { src: "/home.png", alt: "Pantalla de inicio de Valora con el resumen del mes", title: "Inicio", text: "Tu actividad y presupuestos recientes de un vistazo.", delay: "0ms" },
              { src: "/dashboard.png", alt: "Dashboard de Valora con estado de presupuestos", title: "Dashboard", text: "Estado de presupuestos, historial y últimos clientes.", delay: "80ms" },
              { src: "/historial.png", alt: "Historial de presupuestos en Valora", title: "Historial", text: "Filtrá y buscá cualquier presupuesto en segundos.", delay: "160ms" },
              { src: "/nuevopresupuesto.png", alt: "Formulario para crear un nuevo presupuesto en Valora", title: "Nuevo presupuesto", text: "Cargá cliente, ítems y generá el presupuesto al instante.", delay: "240ms" },
            ].map((s) => (
              <div
                key={s.title}
                data-reveal
                style={{ transitionDelay: s.delay }}
                className={`${revealBase} group flex-none text-center w-[150px] sm:w-[180px] lg:w-[220px]`}
              >
                <div className="w-[150px] sm:w-[180px] lg:w-[220px] h-[310px] sm:h-[372px] lg:h-[456px] mx-auto mb-[18px] rounded-[34px] overflow-hidden border-[6px] border-navy bg-navy shadow-[0_10px_20px_rgba(22,35,63,0.12)] transition group-hover:shadow-[0_16px_28px_rgba(22,35,63,0.18)] group-hover:-translate-y-1">
                  <img src={s.src} alt={s.alt} className="w-full h-full object-cover block" />
                </div>
                <h4 className="text-[15.5px] mb-1.5">{s.title}</h4>
                <p className="text-[13.5px] text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-b border-line">
        <div className="max-w-[1160px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 py-14">
          {[
            { num: "3 pasos", desc: "para crear un presupuesto completo", delay: "0ms" },
            { num: "100%", desc: "del historial ordenado y accesible", delay: "100ms" },
            { num: "1 app", desc: "para cotizar, enviar y hacer seguimiento", delay: "200ms" },
          ].map((s) => (
            <div
              key={s.num}
              data-reveal
              style={{ transitionDelay: s.delay }}
              className={`${revealBase} group text-center`}
            >
              <div className="text-4xl font-extrabold text-navy transition-transform duration-300 group-hover:scale-[1.08]">
                {s.num}
              </div>
              <div className="text-muted text-[14.5px] mt-1.5">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="cta">
        <div className="w-full">
          <div className="bg-gradient-to-br from-green to-greenDark text-white text-center px-8 py-20 w-full">
            <h2 className="text-[32px] mb-3.5">Empezá a organizar tus presupuestos hoy</h2>
            <p className="text-[16.5px] text-white/90 max-w-[480px] mx-auto mb-[30px]">
              Dejá tu correo y te avisamos apenas Valora esté disponible para vos.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2.5 justify-center flex-wrap items-stretch sm:items-center max-w-[340px] sm:max-w-none mx-auto"
            >
              <input
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-[18px] py-3.5 rounded-xl border-none 
                text-[15px] min-w-0 sm:min-w-[280px] outline-none text-navy bg-white"
              />
              <button
                type="submit"
                className={`${btnBase} px-7 py-3.5 text-[15px] bg-navy text-white shadow-none hover:bg-[#0E1730] hover:-translate-y-0.5`}
              >
                Quiero probar la app
              </button>
            </form>
            {ctaSuccess && (
              <p className="mt-4 text-sm font-bold">¡Gracias! Te avisaremos apenas esté disponible.</p>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-navy text-white/60 pt-16 pb-8">
        <div className="max-w-[1160px] mx-auto px-6">
          <div className="flex justify-between flex-wrap gap-10 pb-10 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5 font-extrabold text-xl text-white tracking-[-0.01em]">
                <img src="/logo-white.png" alt="Valora" className="h-6 w-auto block" />
              </div>
              <p className="max-w-[280px] text-sm mt-3.5 text-white/50">
                La forma más simple de crear, enviar y hacer seguimiento de tus presupuestos.
              </p>
            </div>

            <div className="flex gap-16 flex-wrap">
              <div>
                <h5 className="text-white text-sm mb-4">Producto</h5>
                <a href="#funciones" className="block text-sm mb-2.5 text-white/55 hover:text-white transition-colors">Funciones</a>
                <a href="#como-funciona" className="block text-sm mb-2.5 text-white/55 hover:text-white transition-colors">Cómo funciona</a>
                <a href="#pantallas" className="block text-sm mb-2.5 text-white/55 hover:text-white transition-colors">Pantallas</a>
              </div>
              <div>
                <h5 className="text-white text-sm mb-4">Empresa</h5>
                <a href="#" className="block text-sm mb-2.5 text-white/55 hover:text-white transition-colors">Sobre Valora</a>
                <a href="#" className="block text-sm mb-2.5 text-white/55 hover:text-white transition-colors">Contacto</a>
              </div>
              <div>
                <h5 className="text-white text-sm mb-4">Legal</h5>
                <a href="#" className="block text-sm mb-2.5 text-white/55 hover:text-white transition-colors">Términos y condiciones</a>
                <a href="#" className="block text-sm mb-2.5 text-white/55 hover:text-white transition-colors">Privacidad</a>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center pt-6 text-[13px] flex-wrap gap-3 text-center">
            <span>© 2026 Valora. Todos los derechos reservados.</span>
          </div>
        </div>
      </footer>

      <button
        onClick={scrollToTop}
        aria-label="Volver arriba"
        className={`fixed right-4 sm:right-6 bottom-4 sm:bottom-6 w-10 h-10 sm:w-[46px] sm:h-[46px] rounded-full bg-navy text-white border-none flex items-center justify-center cursor-pointer shadow-[0_10px_24px_rgba(22,35,63,0.35)] transition-all duration-300 motion-reduce:transition-none z-[60] hover:bg-green hover:-translate-y-1 ${
          backToTopVisible ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-3"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    </div>
  );
}
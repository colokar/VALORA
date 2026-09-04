import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FilePlus2, History, Send, CheckCircle2, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import * as api from "../services/api";
// import Logo from "../components/Logo";
import ValoraLogo1 from "../assets/Logo1.png";
import onboarding from "../assets/onboarding.png";
import onboarding1 from "../assets/onboarding1.png";
import onboarding2 from "../assets/onboarding2.png";
import onboarding3 from "../assets/onboarding3.png";

export default function Onboarding() {
  const { usuario, refrescarUsuario } = useAuth();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [cargando, setCargando] = useState(false);

  const total = 4;
  const esUltimo = slide === total - 1;

  async function finalizar() {
    setCargando(true);
    await api.completarOnboarding(usuario.id, {});
    await refrescarUsuario();
    navigate("/home");
  }

  function siguiente() {
    if (esUltimo) finalizar();
    else setSlide((s) => s + 1);
  }

  return (
    <div className="app-shell bg-[#fdfdfd] relative overflow-hidden">
      {/* Omitir */}
      {!cargando && (
        <button
          onClick={finalizar}
          className="absolute top-[54px] right-8 text-[15px] font-bold text-accent z-20"
        >
          Omitir
        </button>
      )}

      <div className="flex-1 flex flex-col">
        {slide === 0 && <SlidePortada />}
        {slide === 1 && (
          <SlideFeature
            icon={FilePlus2}
            titulo="Creá presupuestos en segundos"
            subtitulo="Completá datos, agregá ítems, condiciones y generá el presupuesto en pocos pasos."
            mock={<img src={onboarding1} alt="Logo VALORA" width={300} style={{ margin: "auto"}}  />}
          />
        )}
        {slide === 2 && (
          <SlideFeature
            icon={History}
            titulo="Todo el historial a tu alcance"
            subtitulo="Consultá y filtrá todos tus presupuestos. Ordenalos por estado o buscá por cliente."
            mock={<img src={onboarding2} alt="Logo VALORA" width={300} style={{ margin: "auto"}}  />}
          />
        )}
        {slide === 3 && (
          <SlideFeature
            icon={Send}
            titulo="Enviá y hacé seguimiento"
            subtitulo="Enviá tus presupuestos a tus clientes y hacé seguimiento del estado hasta su respuesta."
            mock={<img src={onboarding3} alt="Logo VALORA" width={350} style={{ margin: "auto"}}  />}
          />
        )}
      </div>

      {/* Dots + botón siguiente */}
      <div className="flex items-center justify-between px-9 pb-14 pt-2">
        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all ${
                i === slide ? "w-6 h-2.5 bg-primary" : "w-2.5 h-2.5 bg-primary/15"
              }`}
            />
          ))}
        </div>
        <button
          onClick={siguiente}
          disabled={cargando}
          className="w-[52px] h-[52px] rounded-full bg-primary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform disabled:opacity-60"
        >
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
}

function SlidePortada() {
  return (
    <div className="flex flex-col items-center text-center pt-[100px] px-9">
      {/* <Logo size={56} withWordmark /> */}
      <img src={ValoraLogo1} alt="Logo VALORA" width={400} style={{ margin: "auto"}}  />

      <h1 className="text-[28px] leading-9 font-extrabold text-primary mt-9">
        Gestioná tus presupuestos de forma simple y eficiente
      </h1>

      <div className="w-full mt-10">
        {/* <IllustracionResumen /> */}
        <img src={onboarding} alt="Logo VALORA" width={400} style={{ margin: "auto"}}  />
      </div>

      <p className="text-[17px] leading-[26px] font-semibold text-primary mt-8">
        Creá, enviá y hacé seguimiento de todos tus presupuestos desde un solo lugar.
      </p>
    </div>
  );
}



function SlideFeature({ icon: Icon, titulo, subtitulo, mock }) {
  return (
    <div className="flex flex-col items-center text-center pt-[76px] px-9">
      <div className="w-[71px] h-[71px] rounded-2xl bg-primary/10 flex items-center justify-center">
        <Icon size={30} className="text-primary" />
      </div>

      <h1 className="text-[28px] leading-[40px] font-extrabold text-primary mt-9">{titulo}</h1>
      <p className="text-[17px] leading-[26px] font-semibold text-primary/80 mt-3">{subtitulo}</p>

      <div className="w-full mt-8">{mock}</div>
    </div>
  );
}

// --- Mockups livianos que representan las pantallas reales de la app ---

function PhoneFrame({ children }) {
  return (
    <div className="rounded-[22px] border border-gray-100 bg-white shadow-[0_8px_32px_rgba(0,31,77,0.12)] p-4 text-left">
      {children}
    </div>
  );
}



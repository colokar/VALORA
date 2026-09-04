import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

const OPCIONES = [5, 10, 15, 20, 25, 30];

export default function DaysDropdown({ value, onChange }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickFuera(e) {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    }
    document.addEventListener("mousedown", onClickFuera);
    return () => document.removeEventListener("mousedown", onClickFuera);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="vx-input-row w-full justify-between"
      >
        <span className="flex items-center gap-2 text-gray-700">
          <CalendarDays size={17} className="text-gray-400 shrink-0" />
          {value} días
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${abierto ? "rotate-180" : ""}`} />
      </button>

      {abierto && (
        <div className="absolute z-20 top-[calc(100%+4px)] left-0 w-full bg-white rounded-[10px] shadow-[2px_2px_3px_rgba(0,20,60,0.15),4px_4px_17px_rgba(56,65,100,0.16)] overflow-hidden">
          {OPCIONES.map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => {
                onChange(op);
                setAbierto(false);
              }}
              className={`w-full text-center py-3 text-sm border-b border-gray-200 last:border-b-0 transition-colors ${
                op === value ? "bg-primary text-white font-semibold" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {op}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

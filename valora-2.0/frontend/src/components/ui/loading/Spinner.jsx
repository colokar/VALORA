"use client";

import Image from "next/image";

const sizes = {
  sm: {
    spinner: "w-10 h-10 border-[3px]",
    logo: 18,
  },
  md: {
    spinner: "w-14 h-14 border-[4px]",
    logo: 24,
  },
  lg: {
    spinner: "w-20 h-20 border-[5px]",
    logo: 34,
  },
};

export default function Spinner({
  size = "md",
  showLogo = true,
}) {
  const current = sizes[size];

  return (
    <div className="relative flex items-center justify-center">

      <div
        className={`
          ${current.spinner}
          rounded-full
          border-[#013364]/20
          border-t-[#013364]
          animate-spin
        `}
      />

      {showLogo && (
        <div className="absolute">
          <Image
            src="/logo.png"
            alt="Logo"
            width={current.logo}
            height={current.logo}
            priority
            className="select-none"
          />
        </div>
      )}

    </div>
  );
}
"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";


export const Input = forwardRef(
  (
    {
      label,
      error,
      type = "text",
      className = "",
      ...props
    },
    ref
  ) => {


    const [showPassword, setShowPassword] = useState(false);


    const isPassword = type === "password";


    return (

      <div className="w-full">


        {
          label && (

            <label className="block mb-2 text-[#0B376D] font-medium">

              {label}


              {
                error === true && (

                  <span className="text-red-500">
                    *
                  </span>

                )
              }


            </label>

          )
        }



        <div className="relative">


          <input

            ref={ref}

            type={
              isPassword
                ? (showPassword ? "text" : "password")
                : type
            }

            {...props}

            className={cn(

              "w-full h-12 rounded-xl border border-[#0B376D] px-4 pr-12 outline-none transition focus:ring-2 focus:ring-[#0B376D]",

              className

            )}

          />



          {
            isPassword && (

              <button

                type="button"

                onClick={() =>
                  setShowPassword(!showPassword)
                }

                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"

              >

                {
                  showPassword
                    ? <EyeOff size={20} />
                    : <Eye size={20} />
                }


              </button>

            )
          }


        </div>



        {
          typeof error === "string" && (

            <p className="mt-1 text-sm text-red-500">

              {error}

            </p>

          )
        }


      </div>

    );

  }

);


Input.displayName = "Input";
"use client";

export const Terminos = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-[#0B376D]">
            Términos y Condiciones de Uso
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Generador de Presupuestos y Cotizaciones
          </p>
        </div>


        <div className="p-6 overflow-y-auto text-sm text-gray-700 space-y-5 max-h-[60vh]">

          <section>
            <h3 className="font-bold text-[#0B376D]">
              1. Aceptación de los Términos y Condiciones
            </h3>

            <p>
              Al registrarse y utilizar la aplicación, el usuario declara
              haber leído, comprendido y aceptado los presentes Términos y
              Condiciones, así como la Política de Privacidad.
            </p>
          </section>


          <section>
            <h3 className="font-bold text-[#0B376D]">
              2. Registro de usuario
            </h3>

            <p>
              El usuario se compromete a proporcionar información veraz y
              actualizada, mantener la confidencialidad de su contraseña y
              ser responsable de toda actividad realizada desde su cuenta.
            </p>
          </section>


          <section>
            <h3 className="font-bold text-[#0B376D]">
              3. Uso de la plataforma
            </h3>

            <p>
              La aplicación tiene como finalidad facilitar la creación,
              personalización, almacenamiento y envío de presupuestos
              comerciales.
            </p>

            <p className="mt-2">
              Está prohibido utilizar información falsa, suplantar identidad
              de terceros, acceder sin autorización a sistemas o realizar
              actividades fraudulentas.
            </p>
          </section>


          <section>
            <h3 className="font-bold text-[#0B376D]">
              4. Responsabilidad sobre la información ingresada
            </h3>

            <p>
              El usuario es responsable por toda la información cargada en la
              aplicación, incluyendo presupuestos, clientes, precios,
              imágenes, logotipos y documentos.
            </p>
          </section>


          <section>
            <h3 className="font-bold text-[#0B376D]">
              5. Generación de presupuestos
            </h3>

            <p>
              La aplicación facilita la creación automática de presupuestos.
              El usuario debe revisar la información antes de compartirla con
              sus clientes.
            </p>
          </section>


          <section>
            <h3 className="font-bold text-[#0B376D]">
              6. Envío mediante WhatsApp
            </h3>

            <p>
              WhatsApp es un servicio externo. La aplicación no controla su
              funcionamiento, disponibilidad o modificaciones realizadas por
              dicho servicio.
            </p>
          </section>


          <section>
            <h3 className="font-bold text-[#0B376D]">
              7. Protección de datos personales
            </h3>

            <p>
              El tratamiento de datos personales se realizará conforme a la
              normativa aplicable de la República Argentina.
            </p>
          </section>


          <section>
            <h3 className="font-bold text-[#0B376D]">
              8. Propiedad intelectual
            </h3>

            <p>
              Todo el contenido relacionado con la plataforma, incluyendo
              software, diseño, interfaz, marca y componentes gráficos,
              pertenece a sus respectivos titulares.
            </p>
          </section>


          <section>
            <h3 className="font-bold text-[#0B376D]">
              9. Disponibilidad del servicio
            </h3>

            <p>
              Podrán existir interrupciones temporales por mantenimiento,
              actualizaciones o causas técnicas ajenas a la empresa.
            </p>
          </section>


          <section>
            <h3 className="font-bold text-[#0B376D]">
              10. Legislación aplicable
            </h3>

            <p>
              Estos términos se rigen por la legislación de la República
              Argentina.
            </p>
          </section>

        </div>


        <div className="p-5 border-t">
          <button
            onClick={onClose}
            className="w-full h-12 rounded-full bg-[#5B9B82] text-white font-semibold"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
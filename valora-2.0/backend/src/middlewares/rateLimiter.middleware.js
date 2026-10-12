// Importa funciones para validar los datos que llegan en el 
// cuerpo del request
//middleware para limitar la frecuencia de peticiones
import rateLimit from "express-rate-limit";

/**
 * Configuración del limitador de intentos (Protección básica de seguridad)
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Define la ventana de tiempo: 15 minutos en milisegundos
    max: 10, // Permite un máximo de 10 peticiones desde la misma IP dentro de esa ventana
    message: { // Mensaje que se envía al usuario cuando supera el límite
        success: false,
        message: "Demasiados intentos. Por favor intente nuevamente en 15 minutos.",
    },
    standardHeaders: true, // Devuelve información del límite en los headers (RateLimit-*)
    legacyHeaders: false, // Desactiva los headers antiguos (X-RateLimit-*)
});

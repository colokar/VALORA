/**
 * ==================================================
 * AppError — Clase de error operacional tipado
 * ==================================================
 **/
export class AppError extends Error {
    /**
     * @param {string} message   - Mensaje legible para el cliente
     * @param {number} statusCode - HTTP status code (400, 401, 403, 404, 409, 422, 500...)
     * @param {boolean} isOperational - true = error de negocio conocido
     */
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Captura el stack trace sin incluir
        // el constructor de AppError en el trace
        Error.captureStackTrace(this, this.constructor);
    }
}

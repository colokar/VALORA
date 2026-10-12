/**
 * Middleware global de errores
 */
export const errorHandler = (
    error,
    req,
    res,
    next
) => {

    console.error(error);

    return res.status(
        error.statusCode || error.status || 500
    ).json({

        success: false,

        message:
            error.message ||
            "Error interno del servidor"

    });

};
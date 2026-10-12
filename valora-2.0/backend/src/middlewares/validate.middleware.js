import { validationResult } from "express-validator";

/**
 * ==================================================
 * Middleware: validate
 * ==================================================
**/
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Error de validación en los datos enviados",
            errors: errors.array().map((e) => ({
                field: e.path,
                message: e.msg,
            })),
        });
    }

    next();
};
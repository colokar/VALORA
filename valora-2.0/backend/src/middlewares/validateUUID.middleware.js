import { validate as isUUID }
from "uuid";

/**
 * Valida UUID recibido
 */
export const validateUUID = (
    req,
    res,
    next
) => {

    const { id } = req.params;

    if (!isUUID(id)) {

        return res.status(400).json({

            success: false,

            message:
                "ID inválido"

        });

    }

    next();

};
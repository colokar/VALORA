import jwt from "jsonwebtoken";
import {
    findUserByIdRepository
} from "../repositories/usuario.repository.js";
import {
    AUTH_COOKIE_NAME,
    AUTH_COOKIE_OPTIONS,
} from "../config/authCookie.config.js";

// verificacion del token
export const authMiddleware = async (req, res, next) => {
    try {
        const tokenFromCookie = req.cookies?.[AUTH_COOKIE_NAME];
        const authHeader = req.headers.authorization;
        const tokenFromHeader = authHeader ? authHeader.split(" ")[1] : null;
        const token = tokenFromCookie || tokenFromHeader;

        if (!token) {
            res.clearCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
            return res.status(401).json({
                success: false,
                message: "Token no proporcionado",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            res.clearCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
            return res.status(401).json({
                success: false,
                message: "Token inválido o expirado",
            });
        }

        const usuario = await findUserByIdRepository(decoded.id);
        if (!usuario) {
            res.clearCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
            return res.status(401).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        req.usuario = usuario;
        req.auth = { id: usuario.id };
        next();
    } catch (error) {
        next(error);
    }
};
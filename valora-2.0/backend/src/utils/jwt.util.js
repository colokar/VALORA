import jwt from "jsonwebtoken";

export const generarToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
};

export const verificarToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_SECRET
    )
}
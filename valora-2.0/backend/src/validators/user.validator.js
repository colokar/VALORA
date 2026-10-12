import { AppError } from "../utils/AppError.util.js";

export const validateRegisterData = (datos) => {
    const { nombre, apellido, email, nombreEmprendimiento } = datos;

    if (!nombre || !apellido || !email || !nombreEmprendimiento) {
        throw new AppError("Todos los campos son obligatorios", 400);
    }       

}
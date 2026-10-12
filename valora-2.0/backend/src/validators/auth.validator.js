import { body } from "express-validator";


export const registerValidation = [

    body("email")
        .isEmail()
        .withMessage("Debe ser un email válido")
        .trim()
        .toLowerCase(),

    body("password")
        .isString()
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener al menos 8 caracteres")
        .matches(/\d/)
        .withMessage("La contraseña debe contener al menos un número"),

    body("nombreEmprendimiento")
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres")
        .escape(),

];


export const loginValidation = [

    body("email")
        .isEmail()
        .withMessage("Debe ser un email válido")
        .trim()
        .toLowerCase(),

    body("password")
        .isString()
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener al menos 8 caracteres")

];
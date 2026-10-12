import { body } from "express-validator";

export const createItemValidation = [
    body("nombre")
        .trim()
        .notEmpty().withMessage("El nombre del ítem es obligatorio")
        .isLength({ max: 100 }).withMessage("El nombre no puede superar 100 caracteres")
        .escape(),

    body("tipo")
        .trim()
        .notEmpty()
        .withMessage("El tipo de ítem es obligatorio")
        .isIn(["producto", "servicio"])
        .withMessage("El tipo debe ser producto o servicio"),

    body("precio")
        .notEmpty()
        .withMessage("El precio es obligatorio")
        .isFloat({ min: 0 })
        .withMessage("El precio debe ser un número mayor o igual a 0"),
];
import crypto from "crypto";
import bcrypt from "bcrypt";

import {
  findUserByEmailRepository,
  findUserByIdRepository,
  updatePasswordRepository
} from "../repositories/usuario.repository.js";

import {
  createPasswordResetRepository,
  findPasswordResetByTokenRepository,
  deletePasswordResetRepository
} from "../repositories/passwordReset.repository.js";

import { AppError } from "../utils/AppError.util.js";
import { sendMailService } from "./mail.service.js";

const validatePasswordStrength = (password) => {
  if (!password || password.length < 8) {
    throw new AppError("La contraseña debe tener un mínimo de 8 caracteres.", 400);
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    throw new AppError("La contraseña debe incluir mayúsculas, minúsculas y números.", 400);
  }
};

export const forgotPasswordService = async (email) => {
  const user = await findUserByEmailRepository(email);
  if (!user) {
    return true;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await createPasswordResetRepository({ userId: user.id, token, expiresAt });

  await sendMailService({
    to: user.email,
    subject: "Recuperación de contraseña - Valora",
    text: `Recibimos una solicitud para cambiar tu contraseña.\n\nIngresá al siguiente enlace para continuar:\n\n${process.env.FRONTEND_URL}/reset-password/${token}\n\nEste enlace vence en 15 minutos.\n\nSi no solicitaste este cambio, ignorá este correo.`
  });

  return true;
};

export const resetPasswordService = async ({ token, newPassword }) => {
  const reset = await findPasswordResetByTokenRepository(token);
  if (!reset) {
    throw new AppError("El enlace de recuperación es inválido o expiró.", 400);
  }

  const user = await findUserByIdRepository(reset.user_id);
  if (!user) {
    throw new AppError("Usuario no encontrado.", 404);
  }

  validatePasswordStrength(newPassword);

  const samePassword = await bcrypt.compare(newPassword, user.password_hash);
  if (samePassword) {
    throw new AppError("La nueva contraseña debe ser diferente a la anterior.", 400);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await updatePasswordRepository(user.id, passwordHash);
  await deletePasswordResetRepository(token);

  return true;
};
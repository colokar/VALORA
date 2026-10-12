import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  findUserByEmailRepository,
  findUserByIdRepository,
  createUserRepository,
  updateUserDateRepository,
  updateUserCompanyRepository,
  updateUserLogoRepository,
  updateUserRubroCargoRepository,
  updatePasswordRepository
} from "../repositories/usuario.repository.js";

import { uploadLogoService, deleteFileService } from "./files.service.js";
import { validateRegisterData } from "../validators/user.validator.js";
import { AppError } from "../utils/AppError.util.js";

// =========================================
// VALIDACIÓN DE CONTRASEÑA
// =========================================
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

// =========================================
// REGISTRO
// =========================================
export const registerService = async (datos) => {
  validateRegisterData(datos);

  const { nombre, apellido, email, password, nombreEmprendimiento } = datos;

  validatePasswordStrength(password);

  const existingUser = await findUserByEmailRepository(email);
  if (existingUser) {
    throw new AppError("El email ya está registrado", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return await createUserRepository({
    nombre,
    apellido,
    email,
    passwordHash,
    nombreEmprendimiento
  });
};

// =========================================
// LOGIN
// =========================================
export const loginService = async ({ email, password }) => {
  const user = await findUserByEmailRepository(email.trim().toLowerCase());
  if (!user) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      nombreEmprendimiento: user.nombre_emprendimiento
    }
  };
};

// =========================================
// OBTENER USUARIO POR ID
// =========================================
export const getUserByIdService = async (userId) => {
  const user = await findUserByIdRepository(userId);
  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  return {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    nombre_emprendimiento: user.nombre_emprendimiento,
    telefono: user.telefono,
    cargo: user.cargo,
    logo_url: user.logo_url,
    logo_public_id: user.logo_public_id,
    razon_social: user.razon_social,
    cuil_cuit: user.cuil_cuit,
    direccion: user.direccion,
    rubro: user.rubro,
    sitio_web: user.sitio_web,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
};

// =========================================
// ACTUALIZAR DATOS PERSONALES
// =========================================
export const updateUserDateService = async (dato) => {
  const user = await findUserByIdRepository(dato.userId);
  if (!user) {
    throw new AppError("Usuario no existe", 404);
  }

  return await updateUserDateRepository(dato);
};

// =========================================
// ACTUALIZAR RUBRO Y CARGO
// =========================================
export const updateUserRubroCargoService = async (dato) => {
  const user = await findUserByIdRepository(dato.userId);
  if (!user) {
    throw new AppError("Usuario no existe", 404);
  }

  return await updateUserRubroCargoRepository(dato);
};

// =========================================
// ACTUALIZAR EMPRESA
// =========================================
export const updateUserCompanyService = async (dato) => {
  const user = await findUserByIdRepository(dato.userId);
  if (!user) {
    throw new AppError("Usuario no existe", 404);
  }

  return await updateUserCompanyRepository(dato);
};

// =========================================
// ACTUALIZAR LOGO
// =========================================
export const updateUserLogoService = async (id, file) => {
  const user = await findUserByIdRepository(id);
  if (!user) {
    throw new AppError("Usuario no existe", 404);
  }

  let logo_url = user.logo_url;
  let logo_public_id = user.logo_public_id;

  if (file) {
    if (user.logo_public_id) {
      await deleteFileService(user.logo_public_id, "image");
    }

    const { public_id: newPublicId, url: newUrl } = await uploadLogoService(
      file.buffer,
      user.nombre_emprendimiento
    );

    logo_url = newUrl;
    logo_public_id = newPublicId;
  }

  return await updateUserLogoRepository({ id: user.id, logo_url, logo_public_id });
};

// =========================================
// CAMBIAR CONTRASEÑA
// =========================================
export const updatePasswordService = async ({ userId, currentPassword, newPassword }) => {
  const user = await findUserByIdRepository(userId);
  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
  if (!validPassword) {
    throw new AppError("La contraseña actual es incorrecta", 401);
  }

  // Evitar reutilizar contraseña
  if (currentPassword === newPassword) {
    throw new AppError("La nueva contraseña debe ser diferente a la actual.", 400);
  }

  // Validar requisitos contraseña nueva
  validatePasswordStrength(newPassword);

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await updatePasswordRepository(userId, passwordHash);

  return true;
};
import {
  registerService,
  loginService,
  getUserByIdService,
  updateUserDateService,
  updateUserCompanyService,
  updateUserLogoService,
  updateUserRubroCargoService,
  updatePasswordService
} from "../services/auth.service.js";

import {
  forgotPasswordService,
  resetPasswordService
} from "../services/passwordReset.service.js";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
} from "../config/authCookie.config.js";

export const registerController = async (req, res, next) => {
  try {
    const user = await registerService(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await loginService(req.body);
    res.cookie(AUTH_COOKIE_NAME, result.token, AUTH_COOKIE_OPTIONS);
    res.json({ success: true, user: result.user });
  } catch (error) {
    next(error);
  }
};

export const logoutController = (req, res, next) => {
  res.clearCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
  res.status(200).json({ success: true, message: "Sesión cerrada correctamente" });
};

export const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.usuario;
    const user = await getUserByIdService(id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateUserDateController = async (req, res, next) => {
  try {
    const userId = req.usuario.id;
    const dato = { ...req.body, userId };
    const user = await updateUserDateService(dato);
    res.status(200).json({ success: true, message: "Datos actualizados correctamente", user });
  } catch (error) {
    next(error);
  }
};

export const updateUserRubroCargoController = async (req, res, next) => {
  try {
    const userId = req.auth.id;
    const dato = { ...req.body, userId };
    const user = await updateUserRubroCargoService(dato);
    res.status(200).json({ success: true, message: "Datos actualizados correctamente", user });
  } catch (error) {
    next(error);
  }
};

export const updateUserCompanyController = async (req, res, next) => {
  try {
    const userId = req.usuario.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "No autorizado" });
    }
    const dato = { ...req.body, userId };
    const userCompany = await updateUserCompanyService(dato);
    res.status(200).json({ success: true, message: "Empresa actualizada correctamente", userCompany });
  } catch (error) {
    next(error);
  }
};

export const updateUserLogoController = async (req, res, next) => {
  try {
    const file = req.file;
    const { id } = req.usuario;
    const userLogo = await updateUserLogoService(id, file);
    res.status(200).json({ success: true, message: "Logo actualizado correctamente", userLogo });
  } catch (error) {
    next(error);
  }
};

export const updatePasswordController = async (req, res, next) => {
  try {
    await updatePasswordService({
      userId: req.auth.id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword
    });

    res.status(200).json({ success: true, message: "Contraseña actualizada correctamente." });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async (req, res, next) => {
  try {
    await forgotPasswordService(req.body.email);
    res.json({ success: true, message: "Revisá tu correo para continuar." });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    await resetPasswordService({
      token: req.params.token,
      newPassword: req.body.newPassword
    });

    res.status(200).json({ success: true, message: "Contraseña cambiada correctamente." });
  } catch (error) {
    next(error);
  }
};
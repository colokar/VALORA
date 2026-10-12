import api from '@/lib/axios';
import {
  getLocalSessionUser,
  isLocalSessionActive,
  loginLocalUser,
  logoutLocalUser,
  registerLocalUser,
} from '@/services/localAuthService';

const isApiUnavailable = (error) => !error.response;

/**
 * ==================================================
 * authService.js — Servicios de autenticación
 * ==================================================
 **/

/**
 * Inicia sesión con email y contraseña.
 * El backend establece la cookie auth_token automáticamente.
 * @returns {{ success: boolean, user: object }}
 */
export const loginService = async (credentials) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  } catch (error) {
    if (!isApiUnavailable(error)) {
      throw error;
    }
    return loginLocalUser(credentials);
  }
};

/**
 * Registra un nuevo usuario.
 */
export const registerService = async (userData) => {
  try {
    const { data } = await api.post("/auth/register", userData);
    return data;
  } catch (error) {
    if (!isApiUnavailable(error)) {
      throw error;
    }
    return registerLocalUser(userData);
  }
};

/**
 * Cierra la sesión del usuario.
 * El backend elimina la cookie auth_token.
 */
export const logoutService = async () => {
  if (isLocalSessionActive()) {
    return logoutLocalUser();
  }
  const { data } = await api.post('/auth/logout');
  return data;
};

/**
 * Obtiene los datos del usuario autenticado.
 * @returns {{ success: boolean, user: object }}
 */
export const getMeService = async () => {
  if (isLocalSessionActive()) {
    const user = getLocalSessionUser();
    if (!user) {
      throw new Error("No se encontró la cuenta de esta sesión local.");
    }
    return { success: true, user, localMode: true };
  }
  const { data } = await api.get('/auth/me');
  return data;
};

export const updateUserDataService = async (userData) => {
  const { data } = await api.put('/auth/update', userData);
  return data; 
}

export const updateUserRubroCargoService = async (rubroCargoData) => {
  const { data } = await api.put('/auth/updateRubroCargo', rubroCargoData);
  return data;
}

export const updateUserCompanyService = async (companyData) => {

  const { data } = await api.put('/auth/updateCompany', companyData);
  return data;

}

export const updateUserLogoService = async (formData) => {
  const { data } = await api.patch('/auth/updateLogo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export const updatePasswordService = async (
    passwordData
) => {

    const { data } =
        await api.put(
            "/auth/updatePassword",
            passwordData
        );

    return data;
};
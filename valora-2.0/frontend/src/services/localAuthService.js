const USERS_KEY = "valora_local_users_v1";
const SESSION_KEY = "valora_local_session_v1";
const SESSION_COOKIE = "valora_local_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const PASSWORD_ITERATIONS = 310000;

const readUsers = () => {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    throw new Error("No se pudieron leer las cuentas guardadas en este navegador.");
  }
};

const writeUsers = (users) => {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    throw new Error("No se pudieron guardar los datos de la cuenta en este navegador.");
  }
};

const toBase64 = (bytes) => {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
};

const hashPassword = async (password, salt) => {
  const encodedPassword = new TextEncoder().encode(password);
  const key = await window.crypto.subtle.importKey(
    "raw",
    encodedPassword,
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PASSWORD_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256
  );
  return toBase64(new Uint8Array(derivedBits));
};

const createId = () => {
  if (window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  const bytes = window.crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const publicUser = ({ passwordHash, passwordSalt, ...user }) => user;

const persistSession = (userId) => {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ userId, expiresAt })
  );
  document.cookie = `${SESSION_COOKIE}=${expiresAt}; Max-Age=${SESSION_DURATION_MS / 1000}; Path=/; SameSite=Lax`;
};

export const isLocalSessionActive = () => {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    const session = JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null");
    return Boolean(
      session &&
      session.expiresAt > Date.now() &&
      document.cookie.split("; ").some((cookie) =>
        cookie.startsWith(`${SESSION_COOKIE}=${session.expiresAt}`)
      )
    );
  } catch {
    return false;
  }
};

export const registerLocalUser = async (userData) => {
  const email = userData.email.trim().toLowerCase();
  const users = readUsers();
  if (users.some((user) => user.email === email)) {
    throw new Error("Ya existe una cuenta con ese correo en este navegador.");
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const user = {
    id: createId(),
    nombre: userData.nombre.trim(),
    apellido: userData.apellido.trim(),
    email,
    nombreEmprendimiento: userData.nombreEmprendimiento.trim(),
    passwordSalt: toBase64(salt),
    passwordHash: await hashPassword(userData.password, salt),
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, user]);
  return { success: true, user: publicUser(user), localMode: true };
};

export const loginLocalUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = readUsers().find((account) => account.email === normalizedEmail);
  if (!user) {
    throw new Error("No hay una cuenta local con ese correo. Registrate primero.");
  }

  const salt = Uint8Array.from(window.atob(user.passwordSalt), (char) =>
    char.charCodeAt(0)
  );
  const candidateHash = await hashPassword(password, salt);
  if (candidateHash !== user.passwordHash) {
    throw new Error("Correo o contraseña incorrectos.");
  }

  persistSession(user.id);
  return { success: true, user: publicUser(user), localMode: true };
};

export const getLocalSessionUser = () => {
  if (!isLocalSessionActive()) {
    return null;
  }
  const session = JSON.parse(window.localStorage.getItem(SESSION_KEY));
  const user = readUsers().find((account) => account.id === session.userId);
  return user ? publicUser(user) : null;
};

export const logoutLocalUser = () => {
  window.localStorage.removeItem(SESSION_KEY);
  document.cookie = `${SESSION_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
  return { success: true };
};

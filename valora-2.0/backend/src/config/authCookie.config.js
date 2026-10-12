export const AUTH_COOKIE_NAME = "auth_token";
export const AUTH_SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const isProduction = process.env.NODE_ENV === "production";

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: AUTH_SESSION_MAX_AGE,
  path: "/",
};

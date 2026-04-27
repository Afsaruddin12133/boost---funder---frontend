// Auth role types
export const ROLES = Object.freeze({
  INVESTOR: "investor",
  FOUNDER: "founder",
  GUEST: "guest",
  ADMIN: "admin",
});

export const ROLE_LIST = Object.values(ROLES);

export const AUTH_STORAGE_KEY = "boostfundr_token";
export const USER_STORAGE_KEY = "boostfundr_user";

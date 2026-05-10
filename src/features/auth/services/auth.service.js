import api from "@/lib/api";

/**
 * Register a new user.
 * @param {{ firstName: string, lastName: string, email: string, password: string, role: string }} payload
 * @returns {Promise<{ success: boolean, message: string, data: { token: string, user: object } }>}
 */
export async function registerUser(payload) {
  return api.post("/api/v1/auth/register", payload);
}

/**
 * Log in an existing user.
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ success: boolean, message: string, data: { token: string, user: object } }>}
 */
export async function loginUser(payload) {
  return api.post("/api/v1/auth/login", payload);
}

/**
 * Log in using Google token.
 * @param {string} token 
 * @param {string} role 
 */
export async function googleLogin(token, role) {
  return api.post("/api/v1/auth/google-login", { token, role });
}

/**
 * Log in using Facebook token.
 * @param {string} token 
 * @param {string} role 
 */
export async function facebookLogin(token, role) {
  return api.post("/api/v1/auth/facebook-login", { token, role });
}

/**
 * Send password reset OTP.
 * @param {string} email 
 */
export async function forgotPassword(email) {
  return api.post("/api/v1/auth/forgot-password", { email });
}

/**
 * Reset password using OTP.
 * @param {{ email: string, otp: string, newPassword: string }} payload 
 */
export async function resetPassword(payload) {
  return api.post("/api/v1/auth/reset-password", payload);
}

/**
 * Get user profile based on role.
 * @param {string} role 
 */
export async function getProfile(role) {
  if (role === 'investor') return api.get("/api/v1/users/me/investor-profile");
  if (role === 'founder') return api.get("/api/v1/users/me/founder-profile");
  return Promise.reject(new Error("Role not supported for profile fetching"));
}

// Deprecated aggregated export removed. Use named exports above instead.

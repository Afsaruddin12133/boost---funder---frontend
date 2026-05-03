import api from "@/lib/api";

// Helper to unwrap nested user/profile data
const unwrap = (res) => {
  if (res?.data?.data?.user) return res.data.data.user;
  if (res?.data?.user) return res.data.user;
  if (res?.user) return res.user;
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined) return res.data;
  return res;
};

// ─── Founder Profile ─────────────────────────────────────────────────────────
export const getFounderProfile = async () => {
  const res = await api.get("/api/v1/users/me/founder-profile");
  return unwrap(res);
};

export const updateFounderProfile = async (formData) => {
  const res = await api.put("/api/v1/users/me/founder-profile", formData);
  return unwrap(res);
};

// ─── Investor Profile ────────────────────────────────────────────────────────
export const getInvestorProfile = async () => {
  const res = await api.get("/api/v1/users/me/investor-profile");
  return unwrap(res);
};

export const updateInvestorProfile = async (formData) => {
  const res = await api.put("/api/v1/users/me/investor-profile", formData);
  return unwrap(res);
};

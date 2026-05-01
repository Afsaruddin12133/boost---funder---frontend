import api from "@/lib/api";

// GET /api/v1/users/me/founder-profile
// Response shape: { user: { id, firstName, lastName, email, isVerified, profile: {...}|null } }
const unwrap = (res) => {
  if (res?.user !== undefined) return res.user;
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined) return res.data;
  return res;
};

export const getFounderProfile = async () => {
  const res = await api.get("/api/v1/users/me/founder-profile");
  return unwrap(res);
};

export const updateFounderProfile = async (formData) => {
  const res = await api.put("/api/v1/users/me/founder-profile", formData);
  return unwrap(res);
};

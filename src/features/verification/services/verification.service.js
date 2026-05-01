import api from "@/lib/api";

const unwrap = (res) => {
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined) return res.data;
  return res;
};

export const submitVerification = async (formData) => {
  // POST /api/v1/verifications  (multipart/form-data)
  const res = await api.post("/api/v1/users/verifications/founder", formData);
  return unwrap(res);
};

export const getVerificationStatus = async () => {
  // GET /api/v1/verifications/status
  const res = await api.get("/api/v1/users/verifications/founder/status");
  return unwrap(res);
};

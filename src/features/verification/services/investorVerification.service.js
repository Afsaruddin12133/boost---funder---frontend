import api from "@/lib/api";

const unwrap = (res) => {
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined) return res.data;
  return res;
};

export const submitInvestorVerification = async (formData) => {
  const res = await api.post("/api/v1/users/verifications/investor", formData);
  return unwrap(res);
};

export const getInvestorVerificationStatus = async () => {
  const res = await api.get("/api/v1/users/verifications/investor/status");
  return unwrap(res);
};

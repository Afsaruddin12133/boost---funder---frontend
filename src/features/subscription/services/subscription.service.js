import api from "@/lib/api";

const unwrap = (res) => {
  if (res?.data?.data !== undefined) return res.data.data;
  if (res?.data !== undefined) return res.data;
  return res;
};

export const getMySubscription = async () => {
  const res = await api.get("/api/v1/subscription/me");
  return unwrap(res);
};

import api from "@/lib/api";

const unwrap = (response) => {
  if (response?.data?.data !== undefined) return response.data.data;
  if (response?.data !== undefined) return response.data;
  return response;
};

export const getMyDeals = async () => {
  const response = await api.get("/api/v1/deals/founder/me");
  return unwrap(response);
};

export const getDealFeed = async () => {
  const response = await api.get("/api/v1/deals/feed");
  return unwrap(response);
};

export const getDealById = async (id) => {
  const response = await api.get(`/api/v1/deals/feed/${id}`);
  return unwrap(response);
};

export const deleteDeal = async (id) => {
  const response = await api.del(`/api/v1/deals/${id}`);
  return unwrap(response);
};

export const createDeal = async (formData) => {
  const response = await api.post("/api/v1/deals/", formData);
  return unwrap(response);
};

export const updateDeal = async (id, formData) => {
  const response = await api.put(`/api/v1/deals/${id}`, formData);
  return unwrap(response);
};

export const patchDeal = async (id, data) => {
  const response = await api.patch(`/api/v1/deals/${id}`, data);
  return unwrap(response);
};

export const submitDeal = async (id) => {
  const response = await api.patch(`/api/v1/deals/${id}/submit`);
  return unwrap(response);
};

